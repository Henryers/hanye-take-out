package fun.cyhgraph.service;

import fun.cyhgraph.dto.UserDTO;
import fun.cyhgraph.dto.UserLoginDTO;
import fun.cyhgraph.entity.User;

public interface UserService {
    User wxLogin(UserLoginDTO userLoginDTO);

    User getUser(Integer id);

    void update(UserDTO userDTO);
}
