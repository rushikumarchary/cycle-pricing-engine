package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.entity.Item;
import com.itrosys.cycle_engine.enums.IsActive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {

    @Query("SELECT i FROM Item i WHERE i.itemId IN :selectedItemIds")
    List<Item> findItemsByIds(@Param("selectedItemIds") List<Integer> selectedItemIds);

    @Query("SELECT i FROM Item i WHERE i.brand.brandName = :brandName AND i.itemName IN :selectedItems")
    List<Item> findItemsByBrandAndNames(@Param("brandName") String brandName,
                                        @Param("selectedItems") List<String> selectedItems);

    List<Item> findByItemTypeAndIsActiveAndBrand_IsActive(String type, IsActive itemIsActive, IsActive brandIsActive);

    Optional<Item> findByItemNameAndBrand(String itemName, Brand brand);


    List<Item> findByBrand(Brand brand);

    @Query("SELECT DISTINCT i.itemType FROM Item i")
    List<String> findDistinctItemTypes();

    List<Item> findByBrandInAndIsActive(List<Brand> brands, IsActive isActive);

    boolean existsByItemTypeAndBrand_BrandNameAndIsActiveAndItemIdNot(String itemType, String brandName, IsActive isActive, int itemId);


}
