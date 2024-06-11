package fun.cyhgraph.controller.user;

import fun.cyhgraph.constant.JwtClaimsConstant;
import fun.cyhgraph.dto.UserDTO;
import fun.cyhgraph.dto.UserLoginDTO;
import fun.cyhgraph.entity.User;
import fun.cyhgraph.properties.JwtProperties;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.UserService;
import fun.cyhgraph.utils.JwtUtil;
import fun.cyhgraph.vo.UserLoginVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/user/user")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private JwtProperties jwtProperties;

    @PostMapping("/login")
    public Result<UserLoginVO> login(@RequestBody UserLoginDTO userLoginDTO){
        log.info("用户传过来的登录信息：{}", userLoginDTO);
        User user = userService.wxLogin(userLoginDTO);

        // 上面的没抛异常，正常来到这里，说明登录成功
        // claims就是用户数据payload部分
        Map<String, Object> claims = new HashMap<>(); // jsonwebtoken包底层就是Map<String, Object>格式，不能修改！
        claims.put(JwtClaimsConstant.USER_ID, user.getId());
        // 需要加个token给他，再返回响应
        String token = JwtUtil.createJWT(
                jwtProperties.getUserSecretKey(),
                jwtProperties.getUserTtl(),
                claims);
        UserLoginVO userLoginVO = UserLoginVO.builder()
                .id(user.getId())
                .openid(user.getOpenid())
                .token(token)
                .build();
        return Result.success(userLoginVO);
    }

    /**
     * 根据id查询用户
     * @return
     */
    @GetMapping("/{id}")
    public Result<User> getUser(@PathVariable Integer id){
        log.info("用户id:{}", id);
        User user = userService.getUser(id);
        return Result.success(user);
    }

    /**
     * 修改用户信息
     * @param userDTO
     * @return
     */
    @PutMapping
    public Result update(@RequestBody UserDTO userDTO){
        log.info("新的用户信息：{}", userDTO);
        userService.update(userDTO);
        return Result.success();
    }

}
