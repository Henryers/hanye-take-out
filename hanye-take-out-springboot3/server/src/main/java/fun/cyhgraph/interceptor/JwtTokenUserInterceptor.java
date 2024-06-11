package fun.cyhgraph.interceptor;

import fun.cyhgraph.constant.JwtClaimsConstant;
import fun.cyhgraph.context.BaseContext;
import fun.cyhgraph.properties.JwtProperties;
import fun.cyhgraph.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
// 关于servlet的api接口，本身为JavaEE所有，但是SpringBoot3之后换成 Jakarta EE 了
// 原因是 eclipse 拿到 Oracle 转过来的 Java EE 规范之后，因版权问题不能使用 javax 名称，所以需要重命名
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * jwt令牌校验的拦截器
 */
@Component
@Slf4j
public class JwtTokenUserInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtProperties jwtProperties;

    /**
     * 校验jwt
     *
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            // 当前拦截到的不是动态方法，直接放行
            return true;
        }
        // 1、从请求头中获取令牌
        String token = request.getHeader(jwtProperties.getUserTokenName());
        // 2、校验令牌
        try {
            log.info("jwt校验:{}", token);
            Claims claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), token);
            Integer userId = Integer.valueOf(claims.get(JwtClaimsConstant.USER_ID).toString());
            log.info("当前用户的id：{}", userId);
            // 将id存到当前线程thread的局部空间里面，并在controller,service或者其他地方进行调用获取id
            // 这个Client端的线程应该和管理端的不一样，因此有两个线程id
            BaseContext.setCurrentId(userId);
            // 3、通过，放行
            return true;
        } catch (Exception ex) {
            // 4、不通过，响应401状态码
            response.setStatus(401);
            return false;
        }
    }
}