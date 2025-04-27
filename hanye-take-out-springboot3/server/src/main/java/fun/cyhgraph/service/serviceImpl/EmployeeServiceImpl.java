package fun.cyhgraph.service.serviceImpl;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import fun.cyhgraph.constant.MessageConstant;
import fun.cyhgraph.context.BaseContext;
import fun.cyhgraph.dto.EmployeeDTO;
import fun.cyhgraph.dto.EmployeeFixPwdDTO;
import fun.cyhgraph.dto.EmployeeLoginDTO;
import fun.cyhgraph.dto.PageDTO;
import fun.cyhgraph.entity.Employee;
import fun.cyhgraph.exception.PasswordErrorException;
import fun.cyhgraph.exception.EmployeeNotFoundException;
import fun.cyhgraph.mapper.EmployeeMapper;
import fun.cyhgraph.result.PageResult;
import fun.cyhgraph.service.EmployeeService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeMapper employeeMapper;

    /**
     * 员工登录
     * @param employeeLoginDTO
     * @return
     */
    public Employee login(EmployeeLoginDTO employeeLoginDTO) {
        String account = employeeLoginDTO.getAccount();
        String password = employeeLoginDTO.getPassword();
        // 先查数据库，看是否存在该账号
        Employee employee = employeeMapper.getByAccount(account);
        if (employee == null){
            throw new EmployeeNotFoundException(MessageConstant.ACCOUNT_NOT_FOUND);
        }
        // 再将前端传过来的密码进行MD5加密
        password = DigestUtils.md5DigestAsHex(password.getBytes());
        // 和之前存进数据库的加密的密码进行比对，看看是否一样，不一样要抛异常
        if (!password.equals(employee.getPassword())){
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }
        return employee;
    }

    /**
     * 注册/新增员工
     */
    public void register(EmployeeLoginDTO employeeLoginDTO) {
        // 先对用户的密码进行MD5加密，再存到数据库中
        String password = employeeLoginDTO.getPassword();
        password = DigestUtils.md5DigestAsHex(password.getBytes());
        employeeLoginDTO.setPassword(password);

        Employee employee = new Employee();
        // 将userLoginDTO的属性拷贝到user中
        BeanUtils.copyProperties(employeeLoginDTO, employee);
        // 为user其他字段填充默认值(7-3=4个)
        employee.setName("员工");
        employee.setPhone("11111111111");
        employee.setAge(0);
        employee.setGender(1);
        employee.setStatus(1);
        employee.setCreateUser(100); // 100表示员工自己注册，此时还不能拿到BaseContext的currentId，只能用100这个数字表示自己了
        employee.setUpdateUser(100);
        employeeMapper.regEmployee(employee);
    }

    /**
     * 根据id获取员工信息
     * @return
     */
    public Employee getEmployeeById(Integer id) {
        Employee employee = employeeMapper.getById(id);
        return employee;
    }

    /**
     * 员工分页查询
     * @return
     */
    public PageResult employeePageList(PageDTO pageDTO) {
        // 传分页参数给PageHelper自动处理，会自动加上limit和count(*)返回分页结果和总记录数
        PageHelper.startPage(pageDTO.getPage(), pageDTO.getPageSize());
        Page<Employee> pagelist = employeeMapper.pageQuery(pageDTO);
        return new PageResult(pagelist.getTotal(), pagelist.getResult());
    }

    /**
     * 修改员工
     * @param employeeDTO
     */
    public void update(EmployeeDTO employeeDTO) {
        // 缺少时间等字段，需要手动加入，否则Mapper里的autofill注解会为EmployeeDTO去setUpdateTime，然而根本没这个方法导致报错！
        Employee employee = new Employee();
        BeanUtils.copyProperties(employeeDTO, employee);
        employeeMapper.update(employee);
    }

    /**
     * 删除员工
     */
    public void delete(Integer id) {
        employeeMapper.delete(id);
    }

    /**
     * 根据id修改员工状态
     * @param id
     */
    public void onOff(Integer id) {
        employeeMapper.onOff(id);
    }

    /**
     * 管理员新增员工
     * @param employeeDTO
     */
    public void addEmployee(EmployeeDTO employeeDTO) {
        // 先对用户的密码进行MD5加密，再存到数据库中
        String password = employeeDTO.getPassword();
        password = DigestUtils.md5DigestAsHex(password.getBytes());
        employeeDTO.setPassword(password);
        // 创建employee对象，将employeeDTO的属性拷贝到employee中
        Employee employee = new Employee();
        BeanUtils.copyProperties(employeeDTO, employee);
        // 为user其他字段填充默认值
        employee.setStatus(1);
        employeeMapper.addEmployee(employee);
    }

    /**
     * 修改密码
     * @param employeeFixPwdDTO
     */
    public void fixPwd(EmployeeFixPwdDTO employeeFixPwdDTO) {
        String oldPwd = employeeFixPwdDTO.getOldPwd();
        // 将前端传过来的旧密码进行MD5加密
        oldPwd = DigestUtils.md5DigestAsHex(oldPwd.getBytes());
        // 根据id查询当前账号信息
        Integer id = BaseContext.getCurrentId();
        Employee employee = employeeMapper.getById(id);
        // 和之前存进数据库的加密的密码进行比对，看看是否一样，不一样要抛异常
        if (!oldPwd.equals(employee.getPassword())){
            throw new PasswordErrorException(MessageConstant.PASSWORD_ERROR);
        }
        // 旧密码正确，将新密码加密后进行更新
        String newPwd = employeeFixPwdDTO.getNewPwd();
        String password = DigestUtils.md5DigestAsHex(newPwd.getBytes());
        employee.setPassword(password);
        employeeMapper.updatePwd(employee);
    }
}
