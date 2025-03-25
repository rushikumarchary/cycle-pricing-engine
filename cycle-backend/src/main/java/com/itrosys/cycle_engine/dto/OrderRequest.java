package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.Address;
import com.itrosys.cycle_engine.entity.OrderDetails;
import com.itrosys.cycle_engine.entity.OrderItem;
import com.itrosys.cycle_engine.entity.User;
import com.itrosys.cycle_engine.enums.OrderStatus;


import java.time.LocalDateTime;
import java.util.List;


public class OrderRequest {
    private Long userId;
    private Long addressId;
    private List<OrderItemRequest> items;
    private Double shippingCost;

    public OrderRequest() {
    }

    public OrderRequest(Long userId, Long addressId, List<OrderItemRequest> items, Double shippingCost) {
        this.userId = userId;
        this.addressId = addressId;
        this.items = items;
        this.shippingCost = shippingCost;
    }

    public Long getUserId() {
        return userId;
    }



    public List<OrderItemRequest> getItems() {
        return items;
    }

    public Double getShippingCost() {
        return shippingCost != null ? shippingCost : 0.0;
    }

    public void setShippingCost(Double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public double calculateTotalAmount(List<OrderItemRequest> items) {
        return items.stream()
                .mapToDouble(OrderItemRequest::calculateItemTotal)
                .sum();
    }

    public double calculateGST(double amount) {
        return amount * 0.18;
    }

    public double calculateFinalAmount() {
        double subtotal = calculateTotalAmount(items);
        double gst = calculateGST(subtotal);
        return subtotal + gst + getShippingCost();
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public OrderDetails toOrderDetails(User user, Address address) {
        OrderDetails orderDetails = new OrderDetails();
        orderDetails.setUser(user);
        orderDetails.setAddress(address);
        orderDetails.setOrderDate(LocalDateTime.now());
        orderDetails.setStatus(OrderStatus.Pending);
        
        double subtotal = calculateTotalAmount(getItems());
        double gst = calculateGST(subtotal);
        
        orderDetails.setSubtotal(subtotal);
        orderDetails.setGstAmount(gst);
        orderDetails.setShippingCost(getShippingCost());
        orderDetails.setTotalAmount(subtotal + gst + getShippingCost());

        List<OrderItem> orderItems = items.stream().map(item -> item.toOrderItem(orderDetails)).toList();
        orderDetails.setItems(orderItems);

        return orderDetails;
    }

    public Long getAddressId() {
        return addressId;
    }
}
