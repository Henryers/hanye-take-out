package fun.cyhgraph.vo;

import fun.cyhgraph.entity.DishFlavor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 由于根据菜品id查询出来的dish不够，还要有对应的口味信息，因此把返回的数据封装成VO进行规范化处理
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DishVO implements Serializable {

    private Integer id;
    private String name;
    private String pic;
    private String detail;
    private BigDecimal price;
    private String status;
    private Integer categoryId;
    // 修改了数据，要返回更新时间的字段
    private LocalDateTime updateTime;
    private List<DishFlavor> flavors = new ArrayList<>();
}
