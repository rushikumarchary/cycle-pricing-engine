package com.itrosys.cycle_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;


@Getter
@Setter
@Builder
@AllArgsConstructor
public class CartResponse {
    private Long cartId;
    private String brand;
    private int quantity;
    private String thumbnail;
    private Map<String, Map<String, Object>> parts;
    private BigDecimal partPrice;
    private BigDecimal totalPartsPrice;
}