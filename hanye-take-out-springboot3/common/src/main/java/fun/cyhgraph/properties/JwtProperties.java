package fun.cyhgraph.properties;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// 加Component注解，将对象交给IOC容器管理，成为bean对象
@Component
// 标志其为配置属性类，sky.jwt在yml里有标注，存储具体的key value
@ConfigurationProperties(prefix = "login-reg.jwt")
@Data
public class JwtProperties {

    /**
     * 管理端员工生成jwt令牌相关配置
     */
    private String employeeSecretKey;
    private long employeeTtl;
    private String employeeTokenName;

    /**
     * 用户端微信用户生成jwt令牌相关配置
     */
    private String userSecretKey;
    private long userTtl;
    private String userTokenName;

}
