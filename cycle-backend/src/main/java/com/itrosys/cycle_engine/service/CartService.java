package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.CartRequest;
import com.itrosys.cycle_engine.dto.CartResponse;
import com.itrosys.cycle_engine.dto.QuantityCart;
import com.itrosys.cycle_engine.entity.*;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.CartNotFound;
import com.itrosys.cycle_engine.repository.BrandRepository;
import com.itrosys.cycle_engine.repository.CartRepository;
import com.itrosys.cycle_engine.repository.ItemRepository;
import com.itrosys.cycle_engine.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CartService {


    private final CartRepository cartRepository;

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final BrandRepository brandRepository;

    public CartService(ItemRepository itemRepository, CartRepository cartRepository,
                       UserRepository userRepository, BrandRepository brandRepository) {
        this.itemRepository = itemRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.brandRepository = brandRepository;
    }

    private Long getLoggedInUserId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        } else {
            throw new IllegalStateException("User ID not found in authentication context");
        }
    }


    @Transactional
    public String addToCart(CartRequest cartRequest) {

        User user = userRepository.findById(getLoggedInUserId())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));
        // Fetch or create brand based on the name
        Brand brand = brandRepository.findByBrandName(cartRequest.getBrand())
                .orElseThrow(() -> new BrandNotFound("Brand name with" + cartRequest.getBrand() + "not Present"));


        // Fetch the list of items
        List<Item> items = itemRepository.findAllById(cartRequest.getItemIds());

        // Create Cart and set required fields
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setBrand(brand);
        cart.setQuantity(cartRequest.getQuantity());
        cart.setThumbnail(cartRequest.getThumbnail());
        // Create CartItem list and assign to Cart
        List<CartItem> cartItems = items.stream()
                .map(item -> new CartItem(cart, item))
                .toList();

        cart.setCartItems(cartItems);

        cartRepository.save(cart);

        return "Cycle Added successfully";
    }

    public List<CartResponse> getCart() {
        User user = userRepository.findById(getLoggedInUserId())
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        List<Cart> carts = cartRepository.findByUser(user);
        if (carts.isEmpty()) {
            throw new CartNotFound("No carts found for user: " + user.getUsername());
        }

        List<CartResponse> cartResponses = new ArrayList<>();

        for (Cart cart : carts) {
            Map<String, Map<String, Object>> parts = new LinkedHashMap<>();
            BigDecimal partPrice = BigDecimal.ZERO;

            for (CartItem cartItem : cart.getCartItems()) {
                Item item = cartItem.getItem();
                String partType = item.getItemType(); // 🔥 Fetch part type dynamically

                Map<String, Object> partDetails = new LinkedHashMap<>();
                partDetails.put("itemId", item.getItemId());
                partDetails.put("itemName", item.getItemName());
                partDetails.put("price", item.getPrice());

                parts.put(partType, partDetails);
                partPrice = partPrice.add(item.getPrice());
            }

            BigDecimal totalPartsPrice = partPrice.multiply(BigDecimal.valueOf(cart.getQuantity()));

            CartResponse response = new CartResponse(
                    cart.getCartId(),
                    cart.getBrand().getBrandName(),
                    cart.getQuantity(),
                    cart.getThumbnail(),
                    parts,
                    partPrice,
                    totalPartsPrice
            );

            cartResponses.add(response);
        }

        return cartResponses;
    }

    public String handleUpdateQuantity(QuantityCart quantityCart) {
        Cart cart = cartRepository.findById(quantityCart.getCartId())
                .orElseThrow(() -> new CartNotFound("Cart with cartId " + quantityCart.getCartId() + " not found"));

        if (quantityCart.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        cart.setQuantity(quantityCart.getQuantity());
        cartRepository.save(cart);

        return "Cart quantity updated successfully to " + quantityCart.getQuantity();
    }

    public String deleteCartItemById(Long cartId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new CartNotFound("Cart with cartId " + cartId + " not found"));

        cartRepository.delete(cart);

        return "Cart with cartId " + cartId + " deleted successfully.";
    }

    public String clearCartForUser(String userName) {
        User user = userRepository.findByUsername(userName);
        if (user == null) {
            throw new UsernameNotFoundException("User Not Found: " + userName);
        }

        List<Cart> carts = cartRepository.findByUser(user);
        if (carts.isEmpty()) {
            return "No carts found for user: " + userName;
        }

        cartRepository.deleteAll(carts);

        return "All carts for user " + userName + " have been deleted successfully.";
    }

    public Integer getCartItemCount() {

        Long userId = getLoggedInUserId();
        return cartRepository.getCartItemCountByUserId(userId);
    }
}
