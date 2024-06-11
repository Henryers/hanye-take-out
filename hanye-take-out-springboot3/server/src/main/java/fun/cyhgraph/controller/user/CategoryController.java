package fun.cyhgraph.controller.user;

import fun.cyhgraph.entity.Category;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("userCategoryController")
@RequestMapping("/user/category")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 获取所有分类数据
     * @return
     */
    @GetMapping("/list")
    public Result<List<Category>> list(Integer type){
        log.info("用户想要查询的分类（套餐/菜品分类？）：{}", type);
        List<Category> categoryList = categoryService.getList(type);
        return Result.success(categoryList);
    }
}
