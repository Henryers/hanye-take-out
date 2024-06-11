package fun.cyhgraph.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cart implements Serializable {

    private Integer id;
    private String name;
    private Integer userId;
    private Integer dishId;
    private Integer setmealId;
    private String dishFlavor;
    private Integer number;
    private BigDecimal amount;
    private String pic;
    private LocalDateTime createTime;

}
