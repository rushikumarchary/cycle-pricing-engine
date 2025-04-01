package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByUserId(Long userId);
    
    List<Orders> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    List<Orders> findByUserIdAndOrderDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
} 