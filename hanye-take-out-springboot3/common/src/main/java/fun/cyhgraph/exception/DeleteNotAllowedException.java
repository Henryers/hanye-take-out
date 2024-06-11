package fun.cyhgraph.exception;

public class DeleteNotAllowedException extends BaseException{

    public DeleteNotAllowedException(){}

    public DeleteNotAllowedException(String msg){
        super(msg);
    }
}
