package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.CartRequest;
import com.itrosys.cycle_engine.dto.CartResponse;
import com.itrosys.cycle_engine.dto.QuantityCart;
import com.itrosys.cycle_engine.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cart")
public class CartController {


    private CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody CartRequest cartRequest) {
        return ResponseEntity.ok(cartService.addToCart(cartRequest));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<CartResponse>> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @GetMapping("/cartItemCount")
    public ResponseEntity<Integer> getCartItemCount(){
        return ResponseEntity.ok(cartService.getCartItemCount());
    }
    @PatchMapping("/update-quantity")
    public ResponseEntity<String> handleIncrementQuantity(@RequestBody QuantityCart quantityCart){
        return ResponseEntity.ok(cartService.handleUpdateQuantity(quantityCart));
    }
    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<String> handleDeleteCartItemById(@PathVariable("cartId") Long cartId){
        return ResponseEntity.ok(cartService.deleteCartItemById(cartId));
    }

    @DeleteMapping("/clear/{userName}")
    public ResponseEntity<String> handleClearCartForUser(@PathVariable("userName") String userName){
        return ResponseEntity.ok(cartService.clearCartForUser(userName));
    }

}
