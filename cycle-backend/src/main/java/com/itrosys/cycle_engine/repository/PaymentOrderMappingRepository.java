package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.PaymentOrderMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentOrderMappingRepository extends JpaRepository<PaymentOrderMapping, Long> {
    List<PaymentOrderMapping> findByPaymentOrderId(Long paymentOrderId);
} 