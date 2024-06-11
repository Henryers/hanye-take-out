package fun.cyhgraph.mapper;

import com.github.pagehelper.Page;
import fun.cyhgraph.annotation.AutoFill;
import fun.cyhgraph.dto.PageDTO;
import fun.cyhgraph.entity.Employee;
import fun.cyhgraph.enumeration.OperationType;
import org.apache.ibatis.annotations.*;

@Mapper
public interface EmployeeMapper {

    @Select("select * from employee where id = #{id}")
    Employee getById(Integer id);

    @Select("select * from employee where account = #{account}")
    Employee getByAccount(String account);

    @Insert("insert into employee (name, account, password, phone, age, gender, pic, status, create_user, update_user, create_time, update_time) VALUES " +
            "(#{name}, #{account}, #{password}, #{phone}, #{age}, #{gender}, #{pic}, #{status}, #{createUser}, #{updateUser}, #{createTime}, #{updateTime})")
    @AutoFill(value = OperationType.REG)
        // 由于员工自己注册，但还没注册无法拿到线程id，所以createUser、updateUser只能先手动设置100表示自己操作，填充另外2个time字段就行
    void regEmployee(Employee employee);

    @Insert("insert into employee (name, account, password, phone, age, gender, pic, status, create_user, update_user, create_time, update_time) VALUES " +
            "(#{name}, #{account}, #{password}, #{phone}, #{age}, #{gender}, #{pic}, #{status}, #{createUser}, #{updateUser}, #{createTime}, #{updateTime})")
    @AutoFill(value = OperationType.INSERT)
    void addEmployee(Employee employee);

    Page<Employee> pageQuery(PageDTO pageDTO);

    /**
     * 加上注解，指定操作类型，方便自动填充时间字段
     * @param employee
     */
    @AutoFill(value = OperationType.UPDATE)
    void update(Employee employee);

    @Delete("delete from employee where id = #{id}")
    void delete(Integer id);

    @Update("update employee set status = IF(status = 0, 1, 0) where id = #{id}")
    void onOff(Integer id);

    @AutoFill(value = OperationType.UPDATE)
    void updatePwd(Employee employee);
}
