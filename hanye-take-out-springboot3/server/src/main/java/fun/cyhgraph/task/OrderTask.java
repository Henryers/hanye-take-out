package fun.cyhgraph.task;

import fun.cyhgraph.entity.Order;
import fun.cyhgraph.mapper.OrderMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

/**
 * 自定义定时任务，实现订单状态定时处理
 */
@Component
@Slf4j
public class OrderTask {

    @Autowired
    private OrderMapper orderMapper;

    /**
     * 处理支付超时订单
     */
    @Scheduled(cron = "0 * * * * ?") // 表示每分钟第0秒触发
    public void processTimeoutOrder(){
        log.info("处理支付超时订单：{}", new Date());
        LocalDateTime time = LocalDateTime.now().plusMinutes(-15);
        // 每分钟，查询待支付并且超过15分钟的所有订单
        // select * from orders where status = 1 and order_time < 当前时间-15分钟
        List<Order> ordersList = orderMapper.getByStatusAndOrderTimeLT(Order.PENDING_PAYMENT, time);
        // 超时的订单要改为取消，并设置取消原因和取消时间
        if(ordersList != null && !ordersList.isEmpty()){
            ordersList.forEach(order -> {
                order.setStatus(Order.CANCELLED);
                order.setCancelReason("支付超时，自动取消");
                order.setCancelTime(LocalDateTime.now());
                orderMapper.update(order);
            });
        }
    }

    /**
     * 处理“派送中”状态的订单
     */
    @Scheduled(cron = "0 0 1 * * ?") // 表示每次1:00:00触发
    public void processDeliveryOrder(){
        log.info("处理派送中订单：{}", new Date());
        // 每日凌晨1点，查询正在派送中并且下单时间超过1小时的所有订单
        // select * from orders where status = 4 and order_time < 当前时间-1小时
        LocalDateTime time = LocalDateTime.now().plusMinutes(-60);
        List<Order> ordersList = orderMapper.getByStatusAndOrderTimeLT(Order.DELIVERY_IN_PROGRESS, time);
        // 将其状态都改为已完成
        if(ordersList != null && !ordersList.isEmpty()){
            ordersList.forEach(order -> {
                order.setStatus(Order.COMPLETED);
                orderMapper.update(order);
            });
        }
    }

}