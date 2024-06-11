package fun.cyhgraph.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class OrderRejectionDTO implements Serializable {

    private Integer id;
    private String rejectionReason; // 订单拒绝原因

}
