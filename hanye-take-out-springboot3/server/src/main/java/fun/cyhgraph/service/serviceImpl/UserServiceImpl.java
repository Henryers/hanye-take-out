package fun.cyhgraph.service.serviceImpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import fun.cyhgraph.constant.MessageConstant;
import fun.cyhgraph.dto.UserDTO;
import fun.cyhgraph.dto.UserLoginDTO;
import fun.cyhgraph.entity.User;
import fun.cyhgraph.exception.LoginFailedException;
import fun.cyhgraph.mapper.UserMapper;
import fun.cyhgraph.properties.WeChatProperties;
import fun.cyhgraph.service.UserService;
import fun.cyhgraph.utils.HttpClientUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    // 微信服务接口地址
    public static final String WX_LOGIN = "https://api.weixin.qq.com/sns/jscode2session";

    @Autowired
    private WeChatProperties weChatProperties;
    @Autowired
    private UserMapper userMapper;


    /**
     * 用户微信登录
     *
     * @param userLoginDTO
     * @return
     */
    public User wxLogin(UserLoginDTO userLoginDTO) {
        // 调用私有方法，其中利用HttpClient来调用微信API服务，获取openid
        String openid = getOpenId(userLoginDTO.getCode());
        // 判断openid是否为空，如果为空表示登录失败，抛出业务异常
        if (openid == null) {
            throw new LoginFailedException(MessageConstant.LOGIN_FAILED);
        }
        // 判断当前用户是否为新用户
        User user = userMapper.getByOpenid(openid);
        // 如果是新用户，自动完成注册，插入到数据库
        if (user == null) {
            user = User.builder()
                    .openid(openid)
                    .createTime(LocalDateTime.now())
                    .build();
            userMapper.insert(user);
        }
        return user;
    }

    /**
     * 根据id查询用户
     * @param id
     * @return
     */
    public User getUser(Integer id) {
        return userMapper.getById(id);
    }

    /**
     * 修改用户信息
     * @param userDTO
     */
    public void update(UserDTO userDTO) {
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        userMapper.update(user);
    }

    /**
     * 调用微信接口服务，获取微信用户的openid
     * 4参数： appid secret(在小程序平台查看，忘了就重置) 临时登录凭证code 常量authorization_code
     * @param code
     * @return
     */
    private String getOpenId(String code) {
        // 调用微信接口服务，获得当前微信用户的openid
        Map<String, String> map = new HashMap<>();
        map.put("appid", weChatProperties.getAppid());
        map.put("secret", weChatProperties.getSecret());
        map.put("js_code", code);
        map.put("grant_type", "authorization_code");
        // 利用HttpClient来调用微信的API服务，得到序列化好的json
        String json = HttpClientUtil.doGet(WX_LOGIN, map); // 需自定义HttpClientUtil工具类
        // 解析返回的json对象，并抽取其中的openid
        JSONObject jsonObject = JSON.parseObject(json);
        String openid = jsonObject.getString("openid");
        return openid;
    }
}
