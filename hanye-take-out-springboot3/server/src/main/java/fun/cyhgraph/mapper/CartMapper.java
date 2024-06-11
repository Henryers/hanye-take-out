package fun.cyhgraph.mapper;

import fun.cyhgraph.entity.Cart;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@Mapper
public interface CartMapper {

    /**
     * 查找有没有和cart菜品/套餐相同的商品在当前购物车里
     * @param cart
     * @return
     */
    List<Cart> list(Cart cart);

    /**
     * 数量更新+1
     * @param cart
     */
    @Update("update cart set number = #{number} where id = #{id}")
    void updateNumberById(Cart cart);

    /**
     * 插入购物车数据
     *
     * @param shoppingCart
     */
    @Insert("insert into cart (name, user_id, dish_id, setmeal_id, dish_flavor, number, amount, pic, create_time) " +
            " values (#{name},#{userId},#{dishId},#{setmealId},#{dishFlavor},#{number},#{amount},#{pic},#{createTime})")
    void insert(Cart shoppingCart);

    /**
     * 清空购物车
     * @param currentId
     */
    @Delete("delete from cart where user_id = #{currentId}")
    void delete(Integer currentId);

    void deleteByDishId(Integer dishId, String dishFlavor);

    @Delete("delete from cart where setmeal_id = #{setmealId} ")
    void deleteBySetmealId(Integer setmealId);

    void insertBatch(List<Cart> cartList);
}
