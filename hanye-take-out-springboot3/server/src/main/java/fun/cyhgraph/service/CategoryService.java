package fun.cyhgraph.service;

import fun.cyhgraph.dto.CategoryDTO;
import fun.cyhgraph.dto.CategoryTypePageDTO;
import fun.cyhgraph.entity.Category;
import fun.cyhgraph.result.PageResult;

import java.util.List;

public interface CategoryService {
    void addCategory(CategoryDTO categoryDTO);

    PageResult getPageList(CategoryTypePageDTO categoryTypePageDTO);

    List<Category> getList(Integer type);

    Category getById(Integer id);
    void onOff(Integer id);

    void udpate(CategoryDTO categoryDTO);

    void delete(Integer id);

}
