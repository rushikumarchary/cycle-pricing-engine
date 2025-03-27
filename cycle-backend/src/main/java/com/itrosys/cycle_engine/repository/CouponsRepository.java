package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Coupons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface CouponsRepository extends JpaRepository<Coupons, Long> {
   Optional<Coupons> findByCouponCode(String couponCode);
}
