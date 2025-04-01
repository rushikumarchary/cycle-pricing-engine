package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.CouponResponse;
import com.itrosys.cycle_engine.dto.CouponUpdateRequest;

import com.itrosys.cycle_engine.service.CouponsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
public class CouponsController {

    private final CouponsService couponsService;

    public CouponsController(CouponsService couponsService) {
        this.couponsService = couponsService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCoupon(@RequestParam Double percentage,
                                          @RequestParam String couponCode) {
        return ResponseEntity.ok(couponsService.addCoupon(percentage, couponCode));
    }

    @GetMapping("/all")
    public ResponseEntity<List<CouponResponse>> getAllCoupons() {
        return ResponseEntity.ok(couponsService.getAllCoupons());
    }

    @GetMapping("/code/{couponCode}")
    public ResponseEntity<CouponResponse> getCouponByCode(@PathVariable String couponCode) {
        return ResponseEntity.ok(couponsService.getCouponByCode(couponCode));
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<CouponResponse> getCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(couponsService.getCouponById(id));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCoupon(@RequestBody CouponUpdateRequest request) {
        return ResponseEntity.ok(couponsService.updateCoupon(request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCoupon(@PathVariable Long id) {
        return ResponseEntity.ok(couponsService.deleteCoupon(id));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<String> updateStatus(@PathVariable Long id) {
        return ResponseEntity.ok(couponsService.updateStatus(id));
    }
}
