package com.itrosys.cycle_engine.entity;

import com.itrosys.cycle_engine.enums.OrderStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    @Column(nullable = false)   
    private Double subtotal;

    @Column(nullable = false)
    private Double gstAmount;
    
    private Double shippingCost;


    @OneToMany(mappedBy = "orderDetails", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items= new ArrayList<>();

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "address_id", referencedColumnName = "address_id", nullable = false)
    private Address address;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    public List<OrderItem> getItems() {
        if (items == null) {
            items = new ArrayList<>();
        }
        return items;
    }

    public Long getOrderId() {
        return orderId;
    }

    public User getUser() {
        return user;
    }

    public Address getAddress() {
        return address;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public Double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(Double subtotal) {
        this.subtotal = subtotal;
    }

    public Double getGstAmount() {
        return gstAmount;
    }

    public void setGstAmount(Double gstAmount) {
        this.gstAmount = gstAmount;
    }

    public Double getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(Double shippingCost) {
        this.shippingCost = shippingCost;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

}
