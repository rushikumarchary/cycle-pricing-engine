package com.SpringBatch.Repo;

import com.SpringBatch.Entity.IsActiveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.SpringBatch.Entity.Item;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
//    @Query("SELECT i FROM Item i,Brand b WHERE i.brandId=b.brandId AND b.isActive='Y' AND i.isActive = 'Y'")
//    List<Item> findByIsActive();

    List<Item> findAllByIsActiveAndBrand_IsActive(IsActiveStatus isActiveItem,IsActiveStatus isActiveBrand);

    //equi join
    }

