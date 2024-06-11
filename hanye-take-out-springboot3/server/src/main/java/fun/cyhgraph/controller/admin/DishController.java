package fun.cyhgraph.controller.admin;

import fun.cyhgraph.dto.DishDTO;
import fun.cyhgraph.dto.DishPageDTO;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.DishService;
import fun.cyhgraph.vo.DishVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin/dish")
@Slf4j
public class DishController {

    @Autowired
    private DishService dishService;
    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 添加菜品
     * @return
     */
    @PostMapping
    public Result addDishWithFlavor(@RequestBody DishDTO dishDTO){
        log.info("要添加的菜品信息：{}", dishDTO);
        dishService.addDishWithFlavor(dishDTO);
        // 清理缓存数据
        String key = "dish_" + dishDTO.getCategoryId();
        cleanCache(key);
        return Result.success();
    }

    /**
     * 菜品条件分页查询
     * @param dishPageDTO
     * @return
     */
    @GetMapping("/page")
    public Result<PageResult> getPageList(DishPageDTO dishPageDTO){
        log.info("菜品dish分页条件page：{}", dishPageDTO);
        PageResult pageResult = dishService.getPageList(dishPageDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据id查询菜品和对应口味
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<DishVO> getDishWithFlavorById(@PathVariable Integer id){
        log.info("根据id查询菜品：{}", id);
        DishVO dishVO = dishService.getDishWithFlavorById(id);
        return Result.success(dishVO);
    }

    /**
     * 根据id修改起售停售状态
     * @param id
     * @return
     */
    @PutMapping("/status/{id}")
    public Result onOff(@PathVariable Integer id){
        log.info("根据id修改状态，{}", id);
        dishService.onOff(id);
        // 将所有的菜品缓存数据清理掉，所有以dish_开头的key
        cleanCache("dish_*");
        return Result.success();
    }

    /**
     * 更新菜品以及对应口味
     * @param dishDTO
     * @return
     */
    @PutMapping
    public Result updateDishWithFlavor(@RequestBody DishDTO dishDTO){
        log.info("用户传过来的新菜品数据，{}", dishDTO);
        dishService.updateDishWithFlavor(dishDTO);
        // 将所有的菜品缓存数据清理掉，所有以dish_开头的key
        cleanCache("dish_*");
        return Result.success();
    }

    /**
     * 根据ids批量删除菜品数据
     * @RequestParam 表示必须要ids参数，否则会报错
     * @param ids
     * @return
     */
    @DeleteMapping
    public Result deleteBatch(@RequestParam List<Integer> ids){
        log.info("要删除的菜品id列表，{}", ids);
        dishService.deleteBatch(ids);
        // 将所有的菜品缓存数据清理掉，所有以dish_开头的key
        cleanCache("dish_*");
        return Result.success();
    }

    /**
     * 清理缓存数据
     * @param pattern
     */
    public void cleanCache(String pattern){
        Set keys = redisTemplate.keys(pattern);
        redisTemplate.delete(keys);
    }
}
