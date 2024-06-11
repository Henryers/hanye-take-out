package fun.cyhgraph.service;

import fun.cyhgraph.dto.DishDTO;
import fun.cyhgraph.dto.DishPageDTO;
import fun.cyhgraph.entity.Dish;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.vo.DishVO;

import java.util.List;

public interface DishService {
    void addDishWithFlavor(DishDTO dishDTO);

    PageResult getPageList(DishPageDTO dishPageDTO);

    DishVO getDishWithFlavorById(Integer id);

    void updateDishWithFlavor(DishDTO dishDTO);

    void deleteBatch(List<Integer> ids);

    void onOff(Integer id);

    List<DishVO> getDishesWithFlavorById(Dish dish);
}
