package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.OrderResponse;
import com.itrosys.cycle_engine.entity.OrderDetails;
import com.itrosys.cycle_engine.entity.OrderItem;
import com.itrosys.cycle_engine.repository.OrderDetailsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class OrderDetailsService {

    private final OrderDetailsRepository orderDetailsRepository;

    public OrderDetailsService(OrderDetailsRepository orderDetailsRepository) {
        this.orderDetailsRepository = orderDetailsRepository;
    }

    public String createOrder(OrderDetails orderDetails) {
        orderDetails.setOrderDate(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        // Ensure each order item is linked to the orderDetails
        if (orderDetails.getItems() != null) {
            for (OrderItem item : orderDetails.getItems()) {
                item.setOrderDetails(orderDetails);
            }
        }

        // Save orderDetails along with items
        orderDetailsRepository.save(orderDetails);

        return "Order Created Successfully";
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<OrderDetails> orders = orderDetailsRepository.findByUserId(userId);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getLastMonthOrders(Long userId) {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(1);
        List<OrderDetails> orders = orderDetailsRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getLastThreeMonthsOrders(Long userId) {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(3);
        List<OrderDetails> orders = orderDetailsRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getLastSixMonthsOrders(Long userId) {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(6);
        List<OrderDetails> orders = orderDetailsRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    public List<OrderResponse> getOrdersByYear(Long userId, int year) {
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        List<OrderDetails> orders = orderDetailsRepository.findByUserIdAndOrderDateBetween(userId, startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }

    // Admin methods to get all orders
    public List<OrderResponse> getAllOrders() {
        List<OrderDetails> orders = orderDetailsRepository.findAll();
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllLastMonthOrders() {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(1);
        List<OrderDetails> orders = orderDetailsRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllLastThreeMonthsOrders() {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(3);
        List<OrderDetails> orders = orderDetailsRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllLastSixMonthsOrders() {
        LocalDateTime endDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        LocalDateTime startDate = endDate.minusMonths(6);
        List<OrderDetails> orders = orderDetailsRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
    
    public List<OrderResponse> getAllOrdersByYear(int year) {
        LocalDateTime startDate = LocalDateTime.of(year, 1, 1, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        List<OrderDetails> orders = orderDetailsRepository.findByOrderDateBetween(startDate, endDate);
        return OrderResponse.fromEntityList(orders);
    }
}
