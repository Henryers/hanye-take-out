package fun.cyhgraph.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageDTO implements Serializable {

    // 分页查询的page、pageSize不能为空，因此要int(默认为0而不是空)，而且这只是查询参数而不是某个对象的属性
    // 其他DTO对象的属性用Integer，包装类和对象属性对应，能够更加规范(更具体为什么我也不清楚...)
    private int page;
    private int pageSize;
    private String name;
}
