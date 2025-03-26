package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.OrderResponse;
import com.itrosys.cycle_engine.entity.Orders;
import com.itrosys.cycle_engine.repository.OrderRepository;
import org.springframework.stereotype.Service;

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
}
