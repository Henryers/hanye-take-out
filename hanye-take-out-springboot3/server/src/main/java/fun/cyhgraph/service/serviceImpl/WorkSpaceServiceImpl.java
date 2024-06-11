package fun.cyhgraph.service.serviceImpl;

import fun.cyhgraph.entity.Dish;
import fun.cyhgraph.entity.Order;
import fun.cyhgraph.mapper.DishMapper;
import fun.cyhgraph.mapper.OrderMapper;
import fun.cyhgraph.mapper.SetmealMapper;
import fun.cyhgraph.mapper.UserMapper;
import fun.cyhgraph.service.WorkSpaceService;
import fun.cyhgraph.vo.BusinessDataVO;
import fun.cyhgraph.vo.DishOverViewVO;
import fun.cyhgraph.vo.OrderOverViewVO;
import fun.cyhgraph.vo.SetmealOverViewVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class WorkSpaceServiceImpl implements WorkSpaceService {

    @Autowired
    private UserMapper userMapper;
    @Autowired
    private OrderMapper orderMapper;
    @Autowired
    private DishMapper dishMapper;
    @Autowired
    private SetmealMapper setmealMapper;

    /**
     * 工作台今日数据总览
     * @param begin
     * @param end
     * @return
     */
    public BusinessDataVO getBusinessData(LocalDateTime begin, LocalDateTime end) {
        /**
         * 营业额：当日已完成订单的总金额
         * 有效订单：当日已完成订单的数量
         * 订单完成率：有效订单数 / 总订单数
         * 平均客单价：营业额 / 有效订单数
         * 新增用户：当日新增用户的数量
         */

        Map map = new HashMap();
        map.put("begin",begin);
        map.put("end",end);
        // 查询总订单数
        Integer totalOrderCount = orderMapper.countByMap(map);
        map.put("status", Order.COMPLETED);
        // 1、营业额
        Double turnover = orderMapper.sumByMap(map);
        turnover = turnover == null? 0.0 : turnover;
        // 2、有效订单数
        Integer validOrderCount = orderMapper.countByMap(map);
        Double orderCompletionRate = 0.0;
        Double unitPrice = 0.0;
        if(totalOrderCount != 0 && validOrderCount != 0){
            // 3、订单完成率
            orderCompletionRate = validOrderCount.doubleValue() / totalOrderCount;
            // 4、平均客单价
            unitPrice = turnover / validOrderCount;
        }
        // 5、新增用户数
        Integer newUsers = userMapper.countByMap(map);
        return BusinessDataVO.builder()
                .turnover(turnover)
                .validOrderCount(validOrderCount)
                .orderCompletionRate(orderCompletionRate)
                .unitPrice(unitPrice)
                .newUsers(newUsers)
                .build();
    }

    /**
     * 订单数据情况
     * @return
     */
    public OrderOverViewVO getOrderOverView() {
        /**
         * 全部订单 待接单 待派送 已完成 已取消
         */
        Map map = new HashMap();
        map.put("begin", LocalDateTime.now().with(LocalTime.MIN));
        Integer allOrders = orderMapper.countByMap(map);

        map.put("status", Order.TO_BE_CONFIRMED);
        Integer toConfirmed = orderMapper.countByMap(map);
        map.put("status", Order.CONFIRMED);
        Integer toDelivery = orderMapper.countByMap(map);
        map.put("status", Order.COMPLETED);
        Integer completed = orderMapper.countByMap(map);
        map.put("status", Order.CANCELLED);
        Integer canceled = orderMapper.countByMap(map);

        return OrderOverViewVO.builder()
                .allOrders(allOrders)
                .waitingOrders(toConfirmed)
                .deliveredOrders(toDelivery)
                .completedOrders(completed)
                .cancelledOrders(canceled)
                .build();
    }

    /**
     * 菜品总览
     * @return
     */
    public DishOverViewVO getDishOverView() {
        /**
         * 已起售 已停售
         */
        Integer on = dishMapper.getByStatus(1);
        Integer off = dishMapper.getByStatus(0);
        return DishOverViewVO.builder()
                .sold(on)
                .discontinued(off)
                .build();
    }

    /**
     * 套餐总览
     * @return
     */
    public SetmealOverViewVO getSetmealOverView() {
        /**
         * 已起售 已停售
         */
        Integer on = setmealMapper.getByStatus(1);
        Integer off = setmealMapper.getByStatus(0);
        return SetmealOverViewVO.builder()
                .sold(on)
                .discontinued(off)
                .build();
    }

}
