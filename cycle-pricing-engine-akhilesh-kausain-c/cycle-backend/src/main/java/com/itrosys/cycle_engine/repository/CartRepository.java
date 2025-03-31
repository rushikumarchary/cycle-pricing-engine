package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Cart;
import com.itrosys.cycle_engine.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);

    @Query("SELECT COALESCE(SUM(c.quantity), 0) FROM Cart c WHERE c.user.id = :userId")
    Integer getCartItemCountByUserId(@Param("userId") Long userId);
}
