package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.Coupons;
import com.itrosys.cycle_engine.enums.IsActive;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CouponResponse {
    private Long couponId;
    private Double percentage;
    private String couponCode;
    private IsActive isActive;

    public static CouponResponse fromEntity(Coupons coupon) {
        CouponResponse response = new CouponResponse();
        response.setCouponId(coupon.getId());
        response.setCouponCode(coupon.getCouponCode());
        response.setPercentage(coupon.getDiscountPercentage());
        response.setIsActive(coupon.getIsActive());
        return response;
    }

    public static List<CouponResponse> fromEntityList(List<Coupons> coupons) {
        return coupons.stream()
                .map(CouponResponse::fromEntity)
                .collect(Collectors.toList());
    }
} 