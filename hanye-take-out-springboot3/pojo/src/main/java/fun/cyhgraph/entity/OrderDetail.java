package fun.cyhgraph.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 订单明细
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetail implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;
    private String name; // 名称
    private Integer orderId; // 订单id
    private Integer dishId; // 菜品id
    private Integer setmealId; // 套餐id
    private String dishFlavor; // 口味
    private Integer number; // 数量
    private BigDecimal amount; // 金额
    private String pic; // 图片
}
