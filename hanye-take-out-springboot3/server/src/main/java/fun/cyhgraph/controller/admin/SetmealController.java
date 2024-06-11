package fun.cyhgraph.controller.admin;

import fun.cyhgraph.dto.SetmealDTO;
import fun.cyhgraph.dto.SetmealPageDTO;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.result.Result;
import fun.cyhgraph.service.SetmealService;
import fun.cyhgraph.vo.SetmealVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/setmeal")
@Slf4j
public class SetmealController {

    @Autowired
    private SetmealService setmealService;

    /**
     * 新增套餐
     * @param setmealDTO
     * @return
     */
    @PostMapping
    @CacheEvict(cacheNames = "setmealCache", key = "#setmealDTO.categoryId")
    public Result addSetmeal(@RequestBody SetmealDTO setmealDTO){
        log.info("新增套餐的信息：{}", setmealDTO);
        setmealService.addSetmeal(setmealDTO);
        return Result.success();
    }

    /**
     * 套餐条件分页查询
     * @param setmealPageDTO
     * @return
     */
    @GetMapping("/page")
    public Result<PageResult> getPageList(SetmealPageDTO setmealPageDTO){
        log.info("条件分页查询：{}", setmealPageDTO);
        PageResult pageResult = setmealService.getPageList(setmealPageDTO);
        return Result.success(pageResult);
    }

    /**
     * 根据id查询套餐
     * @param id
     * @return
     */
    @GetMapping("/{id}")
    public Result<SetmealVO> getSetmealById(@PathVariable Integer id){
        log.info("要查询的套餐id：{}", id);
        SetmealVO setmealVO = setmealService.getSetmealById(id);
        return Result.success(setmealVO);
    }

    /**
     * 根据id起售停售套餐
     * @param id
     * @return
     */
    @PutMapping("/status/{id}")
    @CacheEvict(cacheNames = "setmealCache", allEntries = true)
    public Result onOff(@PathVariable Integer id){
        log.info("套餐id:{}", id);
        setmealService.onOff(id);
        return Result.success();
    }

    /**
     * 修改套餐
     * @param setmealDTO
     * @return
     */
    @PutMapping
    @CacheEvict(cacheNames = "setmealCache", allEntries = true)
    public Result update(@RequestBody SetmealDTO setmealDTO){
        log.info("修改后的套餐信息：{}", setmealDTO);
        setmealService.update(setmealDTO);
        return Result.success();
    }

    /**
     * 批量删除套餐
     * @param ids
     * @return
     */
    @DeleteMapping
    @CacheEvict(cacheNames = "setmealCache", allEntries = true)
    public Result deleteBatch(@RequestParam List<Integer> ids){
        log.info("批量删除套餐的套餐id集合：{}", ids);
        setmealService.deleteBatch(ids);
        return Result.success();
    }

}
