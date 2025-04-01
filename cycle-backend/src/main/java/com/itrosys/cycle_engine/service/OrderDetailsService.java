package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.entity.OrderDetails;
import com.itrosys.cycle_engine.entity.OrderItem;
import com.itrosys.cycle_engine.repository.OrderDetailsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

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

    public List<OrderDetails> getOrdersByUserId(Long userId) {
        return orderDetailsRepository.findByUserId(userId);
    }

}
