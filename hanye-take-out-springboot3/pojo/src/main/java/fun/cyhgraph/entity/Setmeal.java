package fun.cyhgraph.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Setmeal implements Serializable {

    private Integer id;
    private String name;
    private String pic;
    private String detail;
    private BigDecimal price;
    private Integer status;
    private Integer categoryId;
    private Integer createUser;
    private Integer updateUser;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
