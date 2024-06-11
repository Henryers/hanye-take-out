package fun.cyhgraph.controller.admin;

import fun.cyhgraph.dto.CategoryDTO;
import fun.cyhgraph.dto.CategoryTypePageDTO;
import fun.cyhgraph.dto.PageDTO;
import fun.cyhgraph.entity.Category;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.CategoryService;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/category")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    /**
     * 新增分类
     * @return
     */
    @PostMapping
    public Result addCategory(@RequestBody CategoryDTO categoryDTO){
        categoryService.addCategory(categoryDTO);
        return Result.success();
    }

    /**
     * 分类条件分页查询
     * @param categoryTypePageDTO
     * @return
     */
    @GetMapping("/page")
    public Result<PageResult> getPageList(CategoryTypePageDTO categoryTypePageDTO){
        log.info("用户传过来的带条件的page分页参数：{}", categoryTypePageDTO);
        PageResult pageResult = categoryService.getPageList(categoryTypePageDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据id查询指定分类
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<Category> getById(@PathVariable Integer id){
        log.info("根据id查询分类：{}", id);
        Category category = categoryService.getById(id);
        return Result.success(category);
    }

    /**
     * 起售/停售
     * @return
     */
    @PutMapping("/status/{id}")
    public Result onOff(@PathVariable Integer id){
        categoryService.onOff(id);
        return Result.success();
    }

    /**
     * 更新分类信息
     * @param categoryDTO
     * @return
     */
    @PutMapping
    public Result udpate(@RequestBody CategoryDTO categoryDTO){
        log.info("拿到更新后的信息，{}", categoryDTO);
        categoryService.udpate(categoryDTO);
        return Result.success();
    }

    /**
     * 根据id修改分类
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id){
        log.info("根据id删除分类：{}", id);
        categoryService.delete(id);
        return Result.success();
    }
}
