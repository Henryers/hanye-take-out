package fun.cyhgraph.result;

import lombok.Data;

import java.io.Serializable;

/**
 * 后端统一返回结果
 * @param <T>
 */
@Data
public class Result<T> implements Serializable {

    private Integer code; //编码：0成功，1和其它数字为失败
    private String msg; //错误信息
    private T data; //数据

    /**
     * 注意：静态方法是属于类的而不是对象的，因此才可以Result.success()直接 “类” 调用方法！！！
     * @return
     * @param <T>
     */
    public static <T> Result<T> success() {
        Result<T> result = new Result<T>();
        result.code = 0;
        return result;
    }
    public static <T> Result<T> success(T object) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 0;
        return result;
    }
    public static <T> Result<T> error(String msg) {
        Result result = new Result();
        result.msg = msg;
        result.code = 1;
        return result;
    }

}