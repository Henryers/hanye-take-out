package fun.cyhgraph.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder   // 要能够在controller或者其他地方中快速构造对象，需要在这加上Builder构建器注解
public class EmployeeLoginVO implements Serializable {

    private Integer id;
    private String account;
    private String token;
}
