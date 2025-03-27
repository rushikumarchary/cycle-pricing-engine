package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.CouponUpdateRequest;
import com.itrosys.cycle_engine.entity.Coupons;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.service.CouponsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
public class CouponsController {

    private CouponsService couponsService;

    public CouponsController(CouponsService couponsService) {
        this.couponsService = couponsService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCoupon(@RequestParam Double percentage,
                                          @RequestParam String couponCode) {
        return ResponseEntity.ok(couponsService.addCoupon(percentage, couponCode));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Coupons>> getAllCoupons() {
        return ResponseEntity.ok(couponsService.getAllCoupons());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Coupons> getCouponById(@PathVariable Long id) {
        return ResponseEntity.ok(couponsService.getCouponById(id));
    }

    @GetMapping("/code/{couponCode}")
    public ResponseEntity<Coupons> getCouponByCode(@PathVariable String couponCode) {
        return ResponseEntity.ok(couponsService.getCouponByCode(couponCode));
    }

    @PutMapping("/update")
    public ResponseEntity<String> updateCoupon(@RequestBody CouponUpdateRequest request) {
        return ResponseEntity.ok(couponsService.updateCoupon(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCoupon(@PathVariable Long id) {
        return ResponseEntity.ok(couponsService.deleteCoupon(id));
    }
}
