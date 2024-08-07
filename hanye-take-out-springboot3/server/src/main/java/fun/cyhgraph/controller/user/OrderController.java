package fun.cyhgraph.controller.user;

import fun.cyhgraph.dto.OrderPaymentDTO;
import fun.cyhgraph.dto.OrderSubmitDTO;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.OrderService;
import fun.cyhgraph.vo.OrderPaymentVO;
import fun.cyhgraph.vo.OrderSubmitVO;
import fun.cyhgraph.vo.OrderVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController("userOrderController")
@RequestMapping("/user/order")
@Slf4j
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * 用户下单
     *
     * @param orderSubmitDTO
     * @return
     */
    @PostMapping("/submit")
    public Result<OrderSubmitVO> submit(@RequestBody OrderSubmitDTO orderSubmitDTO) {
        log.info("用户传过来的订单信息-------------------------：{}", orderSubmitDTO);
        OrderSubmitVO orderSubmitVO = orderService.submit(orderSubmitDTO);
        return Result.success(orderSubmitVO);
    }

    /**
     * 当前用户未支付订单数量
     *
     * @return
     */
    @GetMapping("/unPayOrderCount")
    public Result<Integer> unPayOrderCount() {
        log.info("查询当前用户未支付订单数量");
        return Result.success(orderService.unPayOrderCount());
    }

    /**
     * 订单支付
     *
     * @param orderPaymentDTO
     * @return
     */
    @PutMapping("/payment")
    public Result<OrderPaymentVO> payment(@RequestBody OrderPaymentDTO orderPaymentDTO) throws Exception {
        log.info("订单支付：{}", orderPaymentDTO);
        OrderPaymentVO orderPaymentVO = orderService.payment(orderPaymentDTO);
        log.info("生成预支付交易单：{}", orderPaymentVO);
        return Result.success(orderPaymentVO);
    }

    /**
     * 根据id查询订单详情
     *
     * @param id
     * @return
     */
    @GetMapping("/orderDetail/{id}")
    public Result<OrderVO> getById(@PathVariable Integer id) {
        log.info("订单id:{}", id);
        OrderVO orderVO = orderService.getById(id);
        return Result.success(orderVO);
    }

    /**
     * 条件分页查询历史订单
     *
     * @param page
     * @param pageSize
     * @param status   订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消
     * @return
     */
    @GetMapping("/historyOrders")
    public Result<PageResult> page(int page, int pageSize, Integer status) {
        PageResult pageResult = orderService.userPage(page, pageSize, status);
        return Result.success(pageResult);
    }

    /**
     * 用户取消订单
     *
     * @param id
     * @return
     */
    @PutMapping("/cancel/{id}")
    public Result cancel(@PathVariable Integer id) throws Exception {
        log.info("用户取消订单，手动取消或者超时，id为：{}", id);
        orderService.userCancelById(id);
        return Result.success();
    }

    /**
     * 再来一单
     *
     * @param id
     * @return
     */
    @PostMapping("/reOrder/{id}")
    public Result reOrder(@PathVariable Integer id) {
        log.info("根据订单id再来一单：{}", id);
        orderService.reOrder(id);
        return Result.success();
    }


    /**
     * 用户催单
     * @param id
     * @return
     */
    @GetMapping("/reminder/{id}")
    public Result reminder(@PathVariable Integer id){
        log.info("用户催单，订单id:{}", id);
        orderService.reminder(id);
        return Result.success();
    }
}
