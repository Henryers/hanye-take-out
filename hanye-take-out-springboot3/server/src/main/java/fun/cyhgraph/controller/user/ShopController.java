package fun.cyhgraph.controller.user;

import fun.cyhgraph.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController("userShopController") // 重命名，防止两个端admin、user的ShopController冲突
@RequestMapping("/user/shop")
@Slf4j
public class ShopController {

    @Autowired
    private RedisTemplate redisTemplate;

    public static final String KEY = "SHOP_STATUS";

    @GetMapping("/status")
    public Result<Integer> getStatus(){
        Integer status =  (Integer)redisTemplate.opsForValue().get(KEY);
        log.info("当前店铺状态为：{}", status == 1 ? "营业中" : "打烊中");
        return Result.success(status);
    }
}
