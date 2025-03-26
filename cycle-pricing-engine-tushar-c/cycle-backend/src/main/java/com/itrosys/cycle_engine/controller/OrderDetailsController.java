package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.entity.OrderDetails;
import com.itrosys.cycle_engine.service.OrderDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderDetailsController {

    private final OrderDetailsService orderDetailsService;

    public OrderDetailsController(OrderDetailsService orderDetailsService) {
        this.orderDetailsService = orderDetailsService;
    }

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderDetails orderDetails) {
        return ResponseEntity.ok(orderDetailsService.createOrder(orderDetails));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDetails>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderDetailsService.getOrdersByUserId(userId));
    }
}

