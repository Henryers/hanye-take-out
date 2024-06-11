package fun.cyhgraph.mapper;

import fun.cyhgraph.entity.OrderDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface OrderDetailMapper {

    void insertBatch(List<OrderDetail> orderDetailList);

    @Select("select * from order_detail where order_id = #{id}")
    List<OrderDetail> getById(Integer id);
}
