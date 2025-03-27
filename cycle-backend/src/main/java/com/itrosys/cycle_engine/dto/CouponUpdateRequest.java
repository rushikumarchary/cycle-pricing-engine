package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.enums.IsActive;
import lombok.Data;

@Data
public class CouponUpdateRequest {
    private Long id;
    private Double percentage;
    private String couponCode;
    private IsActive isActive;
} 