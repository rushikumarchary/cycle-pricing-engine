package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Specifications;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecificationsRepository extends JpaRepository<Specifications, Long> {
} 