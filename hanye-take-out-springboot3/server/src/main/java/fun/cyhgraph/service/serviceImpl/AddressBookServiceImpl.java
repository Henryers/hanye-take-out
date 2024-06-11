package fun.cyhgraph.service.serviceImpl;

import fun.cyhgraph.context.BaseContext;
import fun.cyhgraph.entity.AddressBook;
import fun.cyhgraph.mapper.AddressBookMapper;
import fun.cyhgraph.service.AddressBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressBookServiceImpl implements AddressBookService {

    @Autowired
    private AddressBookMapper addressBookMapper;

    /**
     * 新增地址
     * @param addressBook
     */
    public void addAddress(AddressBook addressBook) {
        // 要先知道是哪个用户要新增地址，并且刚开始无法设置默认地址，需要在其他前端页面设置
        addressBook.setUserId(BaseContext.getCurrentId());
        addressBook.setIsDefault(0);
        addressBookMapper.insert(addressBook);
    }

    /**
     * 条件查询用户地址
     * @param addressBook
     * @return
     */
    public List<AddressBook> list(AddressBook addressBook) {
        return addressBookMapper.getUserAddress(addressBook);
    }

    /**
     * 修改地址
     * @param addressBook
     */
    public void updateAddress(AddressBook addressBook) {
        addressBookMapper.udpate(addressBook);
    }

    /**
     * 根据id查询地址
     * @param id
     * @return
     */
    public AddressBook getById(Integer id) {
        return addressBookMapper.getById(id);
    }

    /**
     * 设置默认地址
     * @param addressBook
     */
    public void setDefault(AddressBook addressBook) {
        // 1、先把当前用户所有地址都设置成非默认地址
        addressBook.setIsDefault(0);
        addressBook.setUserId(BaseContext.getCurrentId());
        addressBookMapper.updateIsDefaultByUserId(addressBook);
        // 2、再把当前地址设置成默认地址
        addressBook.setIsDefault(1);
        addressBookMapper.udpate(addressBook);
    }

    /**
     * 根据id删除地址
     * @param id
     */
    public void deleteById(Integer id) {
        addressBookMapper.delete(id);
    }

}
