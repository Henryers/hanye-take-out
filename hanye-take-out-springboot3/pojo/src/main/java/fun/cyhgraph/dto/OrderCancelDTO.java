package fun.cyhgraph.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrderCancelDTO implements Serializable {

    private Integer id;
    private String cancelReason; // 订单取消原因

}
