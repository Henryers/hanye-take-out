package fun.cyhgraph.service;

import fun.cyhgraph.vo.BusinessDataVO;
import fun.cyhgraph.vo.DishOverViewVO;
import fun.cyhgraph.vo.OrderOverViewVO;
import fun.cyhgraph.vo.SetmealOverViewVO;

import java.time.LocalDateTime;

public interface WorkSpaceService {
    BusinessDataVO getBusinessData(LocalDateTime begin, LocalDateTime end);

    OrderOverViewVO getOrderOverView();

    DishOverViewVO getDishOverView();

    SetmealOverViewVO getSetmealOverView();
}
