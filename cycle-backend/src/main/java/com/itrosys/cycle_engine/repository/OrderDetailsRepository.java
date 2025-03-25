package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.OrderDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderDetailsRepository extends JpaRepository<OrderDetails, Long> {

    
    List<OrderDetails> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    List<OrderDetails> findByUserId(Long userId);

    List<OrderDetails> findByUserIdAndOrderDateBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
