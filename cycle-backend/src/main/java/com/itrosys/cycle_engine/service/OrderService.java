package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.OrderResponse;
import com.itrosys.cycle_engine.entity.Orders;
import com.itrosys.cycle_engine.enums.OrderStatus;
import com.itrosys.cycle_engine.repository.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public String createOrder(Orders order) {
        order.setOrderDate(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        orderRepository.save(order);
        return "Order Created Successfully";
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Orders> orders = orderRepository.findByUserId(userId);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getLastMonthOrders(Long userId) {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(1);
        List<Orders> orders = orderRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getLastThreeMonthsOrders(Long userId) {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(3);
        List<Orders> orders = orderRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getLastSixMonthsOrders(Long userId) {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(6);
        List<Orders> orders = orderRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getOrdersByYear(Long userId, int year) {
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        List<Orders> orders = orderRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    // Admin methods to get all orders
    public List<OrderResponse> getAllOrders() {
        List<Orders> orders = orderRepository.findAll();
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllLastMonthOrders() {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(1);
        List<Orders> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllLastThreeMonthsOrders() {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(3);
        List<Orders> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllLastSixMonthsOrders() {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(6);
        List<Orders> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllOrdersByYear(int year) {
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        List<Orders> orders = orderRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    @Transactional
    public String updateOrderStatus(Long orderId, String status) {
        // Check if the given status is a valid OrderStatus enum
        OrderStatus orderStatus;
        try {
            orderStatus = OrderStatus.valueOf(status); // Convert string to enum
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid order status: " + status);
        }

        // Find the order by ID
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // Update the order status
        order.setStatus(orderStatus);
        orderRepository.save(order);

        return "Order status updated successfully to " + status;
    }
}
