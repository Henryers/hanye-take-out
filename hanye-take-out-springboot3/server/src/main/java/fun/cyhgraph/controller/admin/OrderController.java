package fun.cyhgraph.controller.admin;

import fun.cyhgraph.dto.OrderCancelDTO;
import fun.cyhgraph.dto.OrderConfirmDTO;
import fun.cyhgraph.dto.OrderPageDTO;
import fun.cyhgraph.dto.OrderRejectionDTO;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.OrderService;
import fun.cyhgraph.vo.OrderStatisticsVO;
import fun.cyhgraph.vo.OrderVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController("adminOrderController")
@RequestMapping("/admin/order")
@Slf4j
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 条件分页查询订单信息
     * @param orderPageDTO
     * @return
     */
    @GetMapping("/conditionSearch")
    public Result<PageResult> conditionSearch(OrderPageDTO orderPageDTO){
        log.info("条件分页查询订单信息：{}", orderPageDTO);
        PageResult pageResult =  orderService.conditionSearch(orderPageDTO);
        return Result.success(pageResult);

    }

    /**
     * 不同状态订单数量统计
     * @return
     */
    @GetMapping("/statistics")
    public Result<OrderStatisticsVO> statistics(){
        OrderStatisticsVO orderStatisticsVO = orderService.statistics();
        return Result.success(orderStatisticsVO);
    }

    /**
     * 根据订单id查询订单信息
     * @param id
     * @return
     */
    @GetMapping("/details/{id}")
    public Result<OrderVO> details(@PathVariable Integer id){
        log.info("根据订单id查询订单详情");
        OrderVO orderVO = orderService.getById(id);
        return Result.success(orderVO);
    }

    /**
     * 接单
     * @param orderConfirmDTO
     * @return
     */
    @PutMapping("/confirm")
    public Result confirm(@RequestBody OrderConfirmDTO orderConfirmDTO){
        log.info("修改订单状态为接单：{}", orderConfirmDTO);
        orderService.confirm(orderConfirmDTO);
        return Result.success();
    }

    /**
     * 拒单
     * @param orderRejectionDTO
     * @return
     */
    @PutMapping("/reject")
    public Result reject(@RequestBody OrderRejectionDTO orderRejectionDTO){
        log.info("拒单，有原因：{}", orderRejectionDTO);
        orderService.reject(orderRejectionDTO);
        return Result.success();
    }

    /**
     * 取消订单
     * @param orderCancelDTO
     * @return
     */
    @PutMapping("/cancel")
    public Result cancel(@RequestBody OrderCancelDTO orderCancelDTO){
        log.info("取消订单，有原因：{}", orderCancelDTO);
        orderService.cancel(orderCancelDTO);
        return Result.success();
    }

    /**
     * 派送订单
     * @param id
     * @return
     */
    @PutMapping("/delivery/{id}")
    public Result delivery(@PathVariable Integer id){
        log.info("派送中：{}", id);
        orderService.delivery(id);
        return Result.success();
    }

    /**
     * 完成订单
     * @param id
     * @return
     */
    @PutMapping("/complete/{id}")
    public Result complete(@PathVariable Integer id){
        log.info("已完成：{}", id);
        orderService.complete(id);
        return Result.success();
    }

}
