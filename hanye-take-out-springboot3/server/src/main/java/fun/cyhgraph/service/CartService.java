package fun.cyhgraph.service;

import fun.cyhgraph.dto.CartDTO;
import fun.cyhgraph.entity.Cart;

import java.util.List;

public interface CartService {
    void add(CartDTO cartDTO);

    List<Cart> getList();

    void clean();

    void sub(CartDTO cartDTO);
}
