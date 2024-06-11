package fun.cyhgraph.mapper;

import fun.cyhgraph.entity.DishFlavor;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DishFlavorMapper {

    void insertBatch(List<DishFlavor> flavorList);

    @Select("select * from dish_flavor where dish_id = #{id}")
    List<DishFlavor> getByDishId(Integer id);

    @Delete("delete from dish_flavor where dish_id = #{dishId}")
    void deleteByDishId(Integer dishId);

    void deleteBatch(List<Integer> ids);
}
