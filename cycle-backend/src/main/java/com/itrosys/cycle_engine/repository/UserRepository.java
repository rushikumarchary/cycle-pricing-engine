package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Integer> {

    Users findByUsername(String username);
}
