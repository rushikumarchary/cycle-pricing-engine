package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.OrderDetails;
import com.itrosys.cycle_engine.entity.OrderItem;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemRequest {
    private String brand;
    private Integer quantity;
    private Double unitPrice;
    private String frame;
    private String handlebar;
    private String seating;
    private String wheel;
    private String brakes;
    private String tyre;
    private String chainAssembly;

    public OrderItemRequest() {
    }

    public OrderItemRequest(String brand, Integer quantity, Double unitPrice, String frame, String handlebar,
                            String seating, String wheel, String brakes, String tyre, String chainAssembly) {
        this.brand = brand;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.frame = frame;
        this.handlebar = handlebar;
        this.seating = seating;
        this.wheel = wheel;
        this.brakes = brakes;
        this.tyre = tyre;
        this.chainAssembly = chainAssembly;
    }

    public double calculateItemTotal() {
        return quantity * unitPrice;
    }

    public OrderItem toOrderItem(OrderDetails orderDetails) {
        OrderItem orderItem = new OrderItem();
        orderItem.setBrand(brand);
        orderItem.setQuantity(quantity);
        orderItem.setUnitPrice(unitPrice);
        orderItem.setTotalPrice(calculateItemTotal());
        orderItem.setFrame(frame);
        orderItem.setHandlebar(handlebar);
        orderItem.setSeating(seating);
        orderItem.setWheel(wheel);
        orderItem.setBrakes(brakes);
        orderItem.setTyre(tyre);
        orderItem.setChainAssembly(chainAssembly);
        orderItem.setOrderDetails(orderDetails);
        return orderItem;
    }
}
