package fun.cyhgraph.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishItemVO implements Serializable {

    private String name;
    private String pic;
    private String detail;
    private Integer copies;

}
