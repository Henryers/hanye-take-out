package fun.cyhgraph.exception;

public class LoginFailedException extends BaseException {
    public LoginFailedException(){}
    public LoginFailedException(String msg){
        super(msg);
    }
}
