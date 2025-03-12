package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Brand;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand,Integer> {

	Optional<Brand> findByBrandName(String brandName);


}
