package fun.cyhgraph.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPaymentDTO implements Serializable {

    private String orderNumber; // 订单号
    private Integer payMethod; // 付款方式

}
