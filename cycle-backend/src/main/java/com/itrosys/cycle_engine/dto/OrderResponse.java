package com.itrosys.cycle_engine.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.itrosys.cycle_engine.entity.OrderDetails;
import com.itrosys.cycle_engine.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private OrderStatus status;
    private Double subtotal;
    private Double gstAmount;
    private Double shippingCost;
    private List<OrderItemResponse> items;
    private Long userId;
    private AddressResponse address;

    public static OrderResponse fromEntity(OrderDetails orderDetails) {
        return OrderResponse.builder()
                .orderId(orderDetails.getOrderId())
                .orderDate(orderDetails.getOrderDate())
                .totalAmount(orderDetails.getTotalAmount())
                .status(orderDetails.getStatus())
                .subtotal(orderDetails.getSubtotal())
                .gstAmount(orderDetails.getGstAmount())
                .shippingCost(orderDetails.getShippingCost())
                .userId(orderDetails.getUser().getId())
                .address(AddressResponse.fromEntity(orderDetails.getAddress()))
                .items(orderDetails.getItems().stream()
                        .map(item -> OrderItemResponse.builder()
                                .id(item.getId())
                                .brand(item.getBrand())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .totalPrice(item.getTotalPrice())
                                .frame(item.getFrame())
                                .handlebar(item.getHandlebar())
                                .seating(item.getSeating())
                                .wheel(item.getWheel())
                                .brakes(item.getBrakes())
                                .tyre(item.getTyre())
                                .chainAssembly(item.getChainAssembly())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    public static List<OrderResponse> fromEntityList(List<OrderDetails> orderDetails) {
        return orderDetails.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }
} 