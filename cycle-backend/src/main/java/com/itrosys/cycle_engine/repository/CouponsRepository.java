package com.itrosys.cycle_engine.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.itrosys.cycle_engine.entity.Coupons;

@Repository
public interface CouponsRepository extends JpaRepository<Coupons, Long> {
    Optional<Coupons> findByCouponCode(String couponCode);
   
}
