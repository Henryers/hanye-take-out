package fun.cyhgraph.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * 订单概览数据
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderOverViewVO implements Serializable {

    private Integer waitingOrders; // 待接单数量
    private Integer deliveredOrders; // 待派送数量
    private Integer completedOrders; // 已完成数量
    private Integer cancelledOrders; // 已取消数量
    private Integer allOrders; // 全部订单

}
