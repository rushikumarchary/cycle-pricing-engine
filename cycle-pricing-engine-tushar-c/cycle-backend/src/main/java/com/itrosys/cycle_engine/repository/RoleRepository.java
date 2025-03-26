package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
