package fun.cyhgraph.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO implements Serializable {

    private Integer id;
    private String name;
    private String account;
    private String password;
    private String phone;
    private Integer age;
    private Integer gender;
    private String pic;
}
