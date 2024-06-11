package fun.cyhgraph.dto;

import lombok.Data;

import java.io.Serializable;

/**
 * Client端用户登录
 */
@Data
public class UserLoginDTO implements Serializable {

    private String code;
}
