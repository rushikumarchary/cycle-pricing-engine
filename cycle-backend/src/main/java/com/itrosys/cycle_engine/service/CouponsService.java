package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.CouponUpdateRequest;
import com.itrosys.cycle_engine.entity.Coupons;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.exception.DuplicateCoupons;
import com.itrosys.cycle_engine.repository.CouponsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CouponsService {

    private CouponsRepository couponsRepository;

    public CouponsService(CouponsRepository couponsRepository) {
        this.couponsRepository = couponsRepository;
    }

    public String addCoupon(Double percentage, String couponCode) {
        if (couponsRepository.findByCouponCode(couponCode).isPresent()) {
            throw new DuplicateCoupons("Coupon Code Already Exists...");
        }

        Coupons coupon = new Coupons();
        coupon.setCouponCode(couponCode);
        coupon.setDiscountPercentage(percentage);
        coupon.setIsActive(IsActive.Y);

        couponsRepository.save(coupon);

        return "Coupon added successfully";
    }

    public List<Coupons> getAllCoupons() {
        return couponsRepository.findAll();
    }

    public Coupons getCouponById(Long id) {
        Coupons coupon = couponsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found with id: " + id));
        
        if (coupon.getIsActive() != IsActive.Y) {
            throw new IllegalArgumentException("Coupon is not active");
        }
        
        return coupon;
    }

    public Coupons getCouponByCode(String couponCode) {
        Coupons coupon = couponsRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new IllegalArgumentException("Coupon not found with code: " + couponCode));
        
        if (coupon.getIsActive() != IsActive.Y) {
            throw new IllegalArgumentException("Coupon is not active");
        }
        
        return coupon;
    }

    public String updateCoupon(CouponUpdateRequest request) {
        Coupons coupon = getCouponById(request.getId());
        
        // Check if the new coupon code already exists (excluding the current coupon)
        if (!coupon.getCouponCode().equals(request.getCouponCode()) && 
            couponsRepository.findByCouponCode(request.getCouponCode()).isPresent()) {
            throw new DuplicateCoupons("Coupon Code Already Exists...");
        }

        coupon.setCouponCode(request.getCouponCode());
        coupon.setDiscountPercentage(request.getPercentage());
        coupon.setIsActive(request.getIsActive());

        couponsRepository.save(coupon);
        return "Coupon updated successfully";
    }

    public String deleteCoupon(Long id) {
        if (!couponsRepository.existsById(id)) {
            throw new IllegalArgumentException("Coupon not found with id: " + id);
        }
        couponsRepository.deleteById(id);
        return "Coupon deleted successfully";
    }
}
