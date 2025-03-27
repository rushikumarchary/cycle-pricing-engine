package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.Orders;
import com.itrosys.cycle_engine.entity.Specifications;
import com.itrosys.cycle_engine.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderResponse {
    private Long orderId;
    private Long userId;
    private AddressDTO address;
    private LocalDateTime orderDate;
    private LocalDateTime estimatedDeliveryDate;
    private String brand;
    private Integer quantity;
    private Double unitPrice;
    private Double subtotal;
    private Double discountAmount;
    private Double gstAmount;
    private Double shippingCost;
    private Double totalAmount;
    private OrderStatus status;
    private String thumbnail;
    private SpecificationsDTO specifications;

    @Data
    public static class SpecificationsDTO {
        private String frame;
        private String handlebar;
        private String seating;
        private String wheel;
        private String brakes;
        private String tyre;
        private String chainAssembly;

        public static SpecificationsDTO fromEntity(Specifications specifications) {
            if (specifications == null) {
                return null;
            }
            SpecificationsDTO dto = new SpecificationsDTO();
            dto.setFrame(specifications.getFrame());
            dto.setHandlebar(specifications.getHandlebar());
            dto.setSeating(specifications.getSeating());
            dto.setWheel(specifications.getWheel());
            dto.setBrakes(specifications.getBrakes());
            dto.setTyre(specifications.getTyre());
            dto.setChainAssembly(specifications.getChainAssembly());
            return dto;
        }
    }

    public static OrderResponse fromEntity(Orders order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(order.getUser().getId());
        response.setAddress(AddressDTO.fromEntity(order.getAddress()));
        response.setOrderDate(order.getOrderDate());
        response.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        response.setBrand(order.getBrand());
        response.setQuantity(order.getQuantity());
        response.setUnitPrice(order.getUnitPrice());
        response.setSubtotal(order.getSubtotal());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setGstAmount(order.getGstAmount());
        response.setShippingCost(order.getShippingCost());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setThumbnail(order.getThumbnail());
        response.setSpecifications(SpecificationsDTO.fromEntity(order.getSpecifications()));
        return response;
    }

    public static List<OrderResponse> fromEntityList(List<Orders> orders) {
        return orders.stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
