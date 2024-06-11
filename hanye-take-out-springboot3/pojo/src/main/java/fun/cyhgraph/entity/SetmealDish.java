package fun.cyhgraph.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SetmealDish implements Serializable {

    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer copies;
    private Integer setmealId;
    private Integer dishId;
}
