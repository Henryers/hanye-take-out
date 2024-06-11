package fun.cyhgraph.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishFlavor implements Serializable {

    private Integer id;
    private String name;
    private String list;
    private Integer dishId;

}
