package fun.cyhgraph.service.serviceImpl;

import fun.cyhgraph.context.BaseContext;
import fun.cyhgraph.dto.CartDTO;
import fun.cyhgraph.entity.Cart;
import fun.cyhgraph.entity.Dish;
import fun.cyhgraph.entity.Setmeal;
import fun.cyhgraph.mapper.CartMapper;
import fun.cyhgraph.mapper.DishMapper;
import fun.cyhgraph.mapper.SetmealMapper;
import fun.cyhgraph.service.CartService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartMapper cartMapper;
    @Autowired
    private DishMapper dishMapper;
    @Autowired
    private SetmealMapper setmealMapper;

    /**
     * 添加进购物车
     *
     * @param cartDTO
     */
    public void add(CartDTO cartDTO) {
        // cart表示当前用户要加入购物车的一条数据
        Cart cart = new Cart();
        BeanUtils.copyProperties(cartDTO, cart);
        cart.setUserId(BaseContext.getCurrentId());
        // 查询该用户自己购物车的所有菜品和套餐，看看有没有和要加入的cart一样的？
        List<Cart> cartList = cartMapper.list(cart);
        // 1、存在，无需再insert，直接数量+1就行
        if (cartList != null && cartList.size() == 1) {
            cart = cartList.get(0);
            cart.setNumber(cart.getNumber() + 1);
            cartMapper.updateNumberById(cart);
        }
        // 2、不存在，需要新增（菜品/套餐），数量为1
        else {
            // 判断当前添加到购物车的是菜品还是套餐
            Integer dishId = cartDTO.getDishId();
            if (dishId != null) {
                // 添加到购物车的是菜品
                Dish dish = dishMapper.getById(dishId);
                cart.setName(dish.getName());
                cart.setPic(dish.getPic());
                cart.setAmount(dish.getPrice());
            } else {
                // 添加到购物车的是套餐
                Setmeal setmeal = setmealMapper.getSetmealById(cartDTO.getSetmealId());
                cart.setName(setmeal.getName());
                cart.setPic(setmeal.getPic());
                cart.setAmount(setmeal.getPrice());
            }
            cart.setNumber(1);
            cart.setCreateTime(LocalDateTime.now());
            cartMapper.insert(cart);
        }
    }

    /**
     * 在购物车中的对应菜品/套餐数量减一
     *
     * @param cartDTO
     */
    public void sub(CartDTO cartDTO) {
        // cart表示当前用户要减少购物车菜品/套餐数量的一条数据
        Cart cart = new Cart();
        BeanUtils.copyProperties(cartDTO, cart);
        cart.setUserId(BaseContext.getCurrentId());
        // 查询该菜品/套餐详细信息（必有，而且只有一条）
        List<Cart> cartList = cartMapper.list(cart);
        cart = cartList.get(0);
        // 1、数量-1后为0，直接把这条记录删除
        if (cart.getNumber() == 1) {
            if (cart.getDishId() != null) {
                // 不能只根据dishId删除，还要考虑到一个菜品可能用户选择了多个口味，对应多个菜品
                cartMapper.deleteByDishId(cart.getDishId(), cart.getDishFlavor());
            } else {
                cartMapper.deleteBySetmealId(cart.getSetmealId());
            }
        }
        // 2、直接数量-1就行
        else {
            cart.setNumber(cart.getNumber() - 1);
            cartMapper.updateNumberById(cart);
        }

    }

    /**
     * 根据userid，获取当前用户的购物车列表
     *
     * @return
     */
    public List<Cart> getList() {
        return cartMapper.list(Cart.builder().
                userId(BaseContext.getCurrentId()).
                build());
    }

    /**
     * 根据userid，清空其购物车
     */
    public void clean() {
        cartMapper.delete(BaseContext.getCurrentId());
    }

}
