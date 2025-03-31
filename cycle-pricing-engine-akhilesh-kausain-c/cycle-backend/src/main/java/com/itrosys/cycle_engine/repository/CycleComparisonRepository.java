package com.itrosys.cycle_engine.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.itrosys.cycle_engine.entity.Cart;
import com.itrosys.cycle_engine.entity.CycleComparison;
import com.itrosys.cycle_engine.entity.User;

import java.util.List;

public interface CycleComparisonRepository extends JpaRepository<CycleComparison, Long> {
	
	   List<CycleComparison> findByUser(User user);
	   boolean existsByUserAndCart(User user, Cart cart);
	   
	   @Query("SELECT COUNT(c) FROM CycleComparison c WHERE c.user.id = :userId")
	   Integer getCountOfItemUserId(@Param("userId") Long userId);



}
