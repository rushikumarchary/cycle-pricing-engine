package com.itrosys.cycle_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long id;
    private String brand;
    private Integer quantity;
    private Double unitPrice;
    private Double totalPrice;
    private String frame;
    private String handlebar;
    private String seating;
    private String wheel;
    private String brakes;
    private String tyre;
    private String chainAssembly;
} 