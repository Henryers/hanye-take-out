package fun.cyhgraph.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrderConfirmDTO implements Serializable {

    private Integer id;
    private Integer status; // 订单状态 1待付款 2待接单 3 已接单 4 派送中 5 已完成 6 已取消 7 退款

}
