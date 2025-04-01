package com.itrosys.cycle_engine.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itrosys.cycle_engine.dto.OrderResponse;

import com.itrosys.cycle_engine.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderDetailsService;

    public OrderController(OrderService orderDetailsService) {
        this.orderDetailsService = orderDetailsService;
    }



    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderDetailsService.getOrdersByUserId(userId));
    }

    @GetMapping("/user/{userId}/last-month")
    public ResponseEntity<List<OrderResponse>> getLastMonthOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderDetailsService.getLastMonthOrders(userId));
    }

    @GetMapping("/user/{userId}/last-three-months")
    public ResponseEntity<List<OrderResponse>> getLastThreeMonthsOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderDetailsService.getLastThreeMonthsOrders(userId));
    }

    @GetMapping("/user/{userId}/last-six-months")
    public ResponseEntity<List<OrderResponse>> getLastSixMonthsOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderDetailsService.getLastSixMonthsOrders(userId));
    }

    @GetMapping("/user/{userId}/year/{year}")
    public ResponseEntity<List<OrderResponse>> getOrdersByYear(@PathVariable Long userId, @PathVariable int year) {
        return ResponseEntity.ok(orderDetailsService.getOrdersByYear(userId, year));
    }

    @PatchMapping("admin/update-status/{orderId}/{status}")
    public ResponseEntity<String> updateOrder(@PathVariable Long orderId, @PathVariable String status){
        return ResponseEntity.ok(orderDetailsService.updateOrderStatus(orderId,status));
    }
  
        @GetMapping("/admin/all")
        public ResponseEntity<List<OrderResponse>> getAllOrders() {
            return ResponseEntity.ok(orderDetailsService.getAllOrders());
        }

        @GetMapping("/admin/last-month")
        public ResponseEntity<List<OrderResponse>> getAllLastMonthOrders() {
            return ResponseEntity.ok(orderDetailsService.getAllLastMonthOrders());
        }

        @GetMapping("/admin/last-three-months")
        public ResponseEntity<List<OrderResponse>> getAllLastThreeMonthsOrders() {
            return ResponseEntity.ok(orderDetailsService.getAllLastThreeMonthsOrders());
        }

        @GetMapping("/admin/last-six-months")
        public ResponseEntity<List<OrderResponse>> getAllLastSixMonthsOrders() {
            return ResponseEntity.ok(orderDetailsService.getAllLastSixMonthsOrders());
        }

        @GetMapping("/admin/year/{year}")
        public ResponseEntity<List<OrderResponse>> getAllOrdersByYear(@PathVariable int year) {
            return ResponseEntity.ok(orderDetailsService.getAllOrdersByYear(year));
        }

//    @PatchMapping("/user/cancel-order/{orderId}")
//    public ResponseEntity<String> cancelOrder(@PathVariable Long orderId) {
//        return ResponseEntity.ok(orderDetailsService.cancelOrder(orderId));
//    }
}

