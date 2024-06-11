package fun.cyhgraph.service.serviceImpl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import fun.cyhgraph.constant.MessageConstant;
import fun.cyhgraph.constant.StatusConstant;
import fun.cyhgraph.dto.DishDTO;
import fun.cyhgraph.dto.DishPageDTO;
import fun.cyhgraph.entity.Dish;
import fun.cyhgraph.entity.DishFlavor;
import fun.cyhgraph.entity.Setmeal;
import fun.cyhgraph.exception.DeleteNotAllowedException;
import fun.cyhgraph.mapper.DishFlavorMapper;
import fun.cyhgraph.mapper.DishMapper;
import fun.cyhgraph.mapper.SetmealDishMapper;
import fun.cyhgraph.mapper.SetmealMapper;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.service.DishService;
import fun.cyhgraph.vo.DishVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DishServiceImpl implements DishService {

    @Autowired
    private DishMapper dishMapper;
    @Autowired
    private DishFlavorMapper dishFlavorMapper;
    @Autowired
    private SetmealDishMapper setmealDishMapper;

    /**
     * 新增菜品
     * @param dishDTO
     */
    public void addDishWithFlavor(DishDTO dishDTO) {
        // 不仅要向dish表添加数据，还要向dish_flavor表添加口味数据
        Dish dish = new Dish();
        BeanUtils.copyProperties(dishDTO, dish);
        dish.setStatus(1);
        dishMapper.addDish(dish);
        System.out.println("新增dish成功！");
        // 由于在动态sql中，用了useGeneralKeys=true，因此会在插入数据后自动返回该行数据的主键id，
        // 并且使用keyProperty="id"，表示将返回的主键值赋值给dish的id属性，下面就可以dish.getId()获取到id
        Integer dishId = dish.getId();
        // 有了DTO中的flavors，加上上面的dish_id，就可以批量插入口味数据到dish_flavor表了

        // 1. 先拿到口味列表
        List<DishFlavor> flavorList = dishDTO.getFlavors();
        if (flavorList != null && !flavorList.isEmpty()) {
            // 2. 再遍历这些口味，每条口味信息都加上dish_id字段，这样相当于DishFlavor就有id,name,value,dish_id四个完整字段了
            flavorList.forEach(dishFlavor -> dishFlavor.setDishId(dishId));
            // 3. 最后批量插入口味数据，动态sql中需要根据,分割，foreach批量插入
            dishFlavorMapper.insertBatch(flavorList);
        }
    }

    /**
     * 根据条件page信息分页查询菜品
     * @param dishPageDTO
     * @return
     */
    public PageResult getPageList(DishPageDTO dishPageDTO) {
        PageHelper.startPage(dishPageDTO.getPage(), dishPageDTO.getPageSize());
        Page<Dish> dishList = dishMapper.getPageList(dishPageDTO);
        return new PageResult(dishList.getTotal(), dishList.getResult());
    }

    /**
     * 根据id查询对应的dish和对应的flavors
     * @param id
     * @return
     */
    public DishVO getDishWithFlavorById(Integer id) {
        // 使用 useGenerateKey 和 keyProperty 来返回对应的id
        Dish dish = dishMapper.getById(id);
        // 根据id查询对应的口味数据
        List<DishFlavor> dishFlavors = dishFlavorMapper.getByDishId(id);
        DishVO dishVO = new DishVO();
        BeanUtils.copyProperties(dish, dishVO);
        dishVO.setFlavors(dishFlavors);
        return dishVO;
    }

    /**
     * 更新菜品和对应口味数据
     * @param dishDTO
     */
    public void updateDishWithFlavor(DishDTO dishDTO) {
        Dish dish = new Dish();
        BeanUtils.copyProperties(dishDTO, dish);
        // 先根据id更新菜品数据
        dishMapper.update(dish);
        // 再根据where dishId=菜品id，去批量更新对应的口味数据
        Integer dishId = dishDTO.getId();
        // 原来的口味和新的口味的行数据量可能不一样，不能直接更新，只能批量删除再批量插入
        // 1. 根据dishId批量删除
        dishFlavorMapper.deleteByDishId(dishId);
        List<DishFlavor> flavorList = dishDTO.getFlavors();
        if (flavorList != null && !flavorList.isEmpty()){
            flavorList.forEach(dishFlavor -> dishFlavor.setDishId(dishId));
            // 2. 再批量插入口味数据
            dishFlavorMapper.insertBatch(flavorList);
        }
    }

    /**
     * 根据菜品id列表，批量删除菜品
     * @param ids
     */
    public void deleteBatch(List<Integer> ids) {
        // 1. 遍历所有菜品，如果有任何一个在起售，则抛异常表示不能删除
        for (Integer id : ids){
            Dish dish = dishMapper.getById(id);
            if (dish.getStatus() == StatusConstant.ENABLE){
                throw new DeleteNotAllowedException(MessageConstant.DISH_ON_SALE);
            }
        }
        // 2. 遍历所有菜品，如果有关联套餐也不能删除
        List<Integer> setmealIds = setmealDishMapper.getSetmealIdsByDishIds(ids);
        if (setmealIds != null && !setmealIds.isEmpty()){
            throw new DeleteNotAllowedException(MessageConstant.DISH_BE_RELATED_BY_SETMEAL);
        }
        // 可以批量删除菜品和对应口味数据了
        dishMapper.deleteBatch(ids);
        dishFlavorMapper.deleteBatch(ids);
    }

    /**
     * 根据id修改起售停售状态
     * @param id
     */
    public void onOff(Integer id) {
        dishMapper.onOff(id);
    }

    /**
     * 获取对应分类下的所有菜品，包括对应口味
     * @param dish
     * @return
     */
    public List<DishVO> getDishesWithFlavorById(Dish dish) {
        List<Dish> dishList = dishMapper.getList(dish);
        List<DishVO> dishVOList = new ArrayList<>();
        // 对菜品列表的每个菜品都加上对应口味，分别封装成DishVO再返回
        for (Dish d : dishList){
            DishVO dishVO = new DishVO();
            BeanUtils.copyProperties(d, dishVO);
            List<DishFlavor> flavors = dishFlavorMapper.getByDishId(d.getId());
            dishVO.setFlavors(flavors);
            dishVOList.add(dishVO);
        }
        return dishVOList;
    }

}
