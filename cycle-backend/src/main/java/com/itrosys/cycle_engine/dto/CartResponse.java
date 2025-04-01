package com.itrosys.cycle_engine.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Map;

@Getter
@Setter
@Builder
public class CartResponse {
    private Long cartId;
    private String brand;
    private int quantity;
    private String thumbnail;
    private Map<String, Map<String, Object>> parts;
    private BigDecimal partPrice;
    private BigDecimal totalPartsPrice;

    public CartResponse(Long cartId, String brand, int quantity, String thumbnail, Map<String, Map<String, Object>> parts, BigDecimal partPrice, BigDecimal totalPartsPrice) {
        this.cartId=cartId;
        this.brand = brand;
        this.quantity = quantity;
        this.thumbnail = thumbnail;
        this.parts = parts;
        this.partPrice = partPrice;
        this.totalPartsPrice = totalPartsPrice;
    }
}