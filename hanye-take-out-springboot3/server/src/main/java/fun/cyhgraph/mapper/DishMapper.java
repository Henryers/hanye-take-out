package fun.cyhgraph.mapper;

import com.github.pagehelper.Page;
import fun.cyhgraph.annotation.AutoFill;
import fun.cyhgraph.dto.DishDTO;
import fun.cyhgraph.dto.DishPageDTO;
import fun.cyhgraph.entity.Dish;
import fun.cyhgraph.enumeration.OperationType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface DishMapper {
    @AutoFill(OperationType.INSERT)
    void addDish(Dish dish);

    Page<Dish> getPageList(DishPageDTO dishPageDTO);

    @Select("select * from dish where id = #{id}")
    Dish getById(Integer id);

    @AutoFill(OperationType.UPDATE)
    void update(Dish dish);

    void deleteBatch(List<Integer> ids);

    @Update("update dish set status = IF(status = 0, 1, 0) where id = #{id}")
    void onOff(Integer id);

    List<Dish> getList(Dish dish);

    @Select("select count(id) from dish where status = #{i}")
    Integer getByStatus(int i);
}
