package fun.cyhgraph.mapper;

import com.github.pagehelper.Page;
import fun.cyhgraph.dto.GoodsSalesDTO;
import fun.cyhgraph.dto.OrderPageDTO;
import fun.cyhgraph.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Mapper
public interface OrderMapper {

    void insert(Order order);

    @Select("select * from orders where id = #{id}")
    Order getById(Integer id);

    Page<Order> page(OrderPageDTO orderPageDTO);

    void update(Order order);

    /**
     * 修改订单状态，支付状态，结账时间
     * @param orderStatus
     * @param orderPaidStatus
     * @param checkOutTime
     * @param id
     */
    @Update("update orders set status = #{orderStatus}, pay_status = #{orderPaidStatus}, checkout_time = #{checkOutTime} " +
            "where id = #{id}")
    void updateStatus(Integer orderStatus, Integer orderPaidStatus, LocalDateTime checkOutTime, Integer id);

    @Select("select count(id) from orders where user_id = #{userId} and status = 1")
    Integer getUnPayCount(Integer userId);

    @Select("select count(id) from orders where status = #{status}")
    Integer countByStatus(Integer status);

    /**
     * 根据状态和下单时间查询订单
     * @param status
     * @param orderTime
     */
    @Select("select * from orders where status = #{status} and order_time < #{orderTime}")
    List<Order> getByStatusAndOrderTimeLT(Integer status, LocalDateTime orderTime);

    Double sumByMap(Map map);

    Integer countByMap(Map map);

    List<GoodsSalesDTO> getSalesTop10(LocalDateTime beginTime, LocalDateTime endTime);
}
