package com.itrosys.cycle_engine.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.itrosys.cycle_engine.config.UserInfo;
import com.itrosys.cycle_engine.dto.CouponResponse;
import com.itrosys.cycle_engine.dto.CouponUpdateRequest;
import com.itrosys.cycle_engine.entity.Coupons;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.exception.CouponNotFound;
import com.itrosys.cycle_engine.exception.DuplicateCoupons;
import com.itrosys.cycle_engine.repository.CouponsRepository;

@Service
public class CouponsService {

    private final CouponsRepository couponsRepository;
    
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
        coupon.setModifiedBy(UserInfo.getLoggedInUsername());

        couponsRepository.save(coupon);

        return "Coupon added successfully";
    }

    public List<CouponResponse> getAllCoupons() {
        return CouponResponse.fromEntityList(couponsRepository.findAll());
    }

    public CouponResponse getCouponById(Long id) {
        Coupons coupon = couponsRepository.findById(id)
                .orElseThrow(() -> new CouponNotFound("Coupon not found with id: " + id));

        if (coupon.getIsActive() != IsActive.Y) {
            throw new CouponNotFound("Coupon is not active");
        }

        return CouponResponse.fromEntity(coupon);
    }

    public CouponResponse getCouponByCode(String couponCode) {
        Coupons coupon = couponsRepository.findByCouponCode(couponCode)
                .orElseThrow(() -> new CouponNotFound("Coupon not found with code: " + couponCode));

        if (coupon.getIsActive() != IsActive.Y) {
            throw new CouponNotFound("Coupon is not active");
        }

        return CouponResponse.fromEntity(coupon);
    }

    public String updateCoupon(CouponUpdateRequest request) {

        System.out.println("update coupon service start");
        System.out.println(request.getPercentage());
        Coupons coupon = couponsRepository.findById(request.getCouponId())
                .orElseThrow(() -> new CouponNotFound("Coupon not found with id: " + request.getCouponId()));

        System.out.println("coupon found");

        // Check if the new coupon code already exists (excluding the current coupon)
        if (!coupon.getCouponCode().equals(request.getCouponCode()) &&
                couponsRepository.findByCouponCode(request.getCouponCode()).isPresent()) {
            throw new DuplicateCoupons("Coupon Code Already Exists...");
        }
        System.out.println(" coupon code checked");

        coupon.setCouponCode(request.getCouponCode());
        coupon.setDiscountPercentage(request.getPercentage());
        coupon.setIsActive(request.getIsActive());
        coupon.setModifiedBy(UserInfo.getLoggedInUsername());

        couponsRepository.save(coupon);
        return "Coupon updated successfully";
    }

    public String deleteCoupon(Long id) {
        if (!couponsRepository.existsById(id)) {
            throw new CouponNotFound("Coupon not found with id: " + id);
        }
        couponsRepository.deleteById(id);
        return "Coupon deleted successfully";
    }

    public String updateStatus(Long id) {
        Coupons coupons = couponsRepository.findById(id)
                .orElseThrow(() -> new CouponNotFound("Coupon Not found with it" + id));

        if (coupons.getIsActive() == IsActive.Y) {
            coupons.setIsActive(IsActive.N);
            coupons.setModifiedBy(UserInfo.getLoggedInUsername());
            couponsRepository.save(coupons);
            return "Coupon Status Inactivated successfully";
        }
        coupons.setIsActive(IsActive.Y);
        coupons.setModifiedBy(UserInfo.getLoggedInUsername());
        couponsRepository.save(coupons);
        return "Coupon Status activated successfully";
    }
}
