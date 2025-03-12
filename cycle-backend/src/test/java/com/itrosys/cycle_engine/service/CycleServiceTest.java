package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.BrandResponse;

import com.itrosys.cycle_engine.dto.Cycle;
import com.itrosys.cycle_engine.dto.CycleResponse;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.ItemNotFound;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CycleServiceTest {

    private final CycleService cycleService;

    @Autowired
    public CycleServiceTest(CycleService cycleService){
        this.cycleService=cycleService;
    }
    @Test
    void testGetAllBrands() {
        List<BrandResponse> brands = cycleService.getAllBrands();
        assertNotNull(brands);
        assertTrue(brands.size() >= 0);
        System.out.println("testGetAllBrands Passed: " + brands);
    }

    @Test
    void testGetGroupedItemNameAndTypeByBrandName_ValidBrand() {
        String brandName = "ATLAS";
        Map<String, List<Map<String, Object>>> result = cycleService.getGroupedItemNameAndTypeByBrandName(brandName);
        assertNotNull(result);
        assertFalse(result.isEmpty());
        System.out.println("Test Passed: " + result);
    }

    @Test
    void testGetGroupedItemNameAndTypeByBrandName_BrandNotFound() {
        String brandName = "Tata";
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.getGroupedItemNameAndTypeByBrandName(brandName));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testGetGroupedItemNameAndTypeByBrandName_InactiveBrand() {
        String brandName = "HERO";
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.getGroupedItemNameAndTypeByBrandName(brandName));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testGetGroupedItemNameAndTypeByBrandName_NoItemsFound() {
        String brandName = "SONY";
        Exception exception = assertThrows(ItemNotFound.class, () -> cycleService.getGroupedItemNameAndTypeByBrandName(brandName));
        System.out.println("Test Passed: " + exception.getMessage());
    }


    @Test
    void testCalculateTotalPrice_Success() {
        Cycle cycle = new Cycle("ATLAS", "Tube", "Spokes", "Aluminum",
                "Upright", "Disc", "6 Gears", "Flat");
        CycleResponse response = cycleService.calculateTotalPrice(cycle);
        assertNotNull(response);
        System.out.println("Test Passed: " + response);
    }

    @Test
    void testCalculateTotalPrice_NullParts() {
        Cycle cycle = new Cycle("ATLAS", null, "Spokes", "Steel",
                "Upright", "Disc", "6 Gears", "Flat");
        Exception exception = assertThrows(IllegalArgumentException.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_BrandNotFound() {
        Cycle cycle = new Cycle("TATA", "Tube Tyre", "Spokes", "Steel",
                "Upright", "Disc", "6 Gears", "Flat");
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_InactiveBrand() {
        Cycle cycle = new Cycle("HERO", "Tube", "Spokes", "Steel",
                "Upright", "Disc", "6 Gears", "Flat");
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_ItemNotFound() {
        Cycle cycle = new Cycle("ATLAS", "Unknown", "Spokes", "Steel",
                "Upright", "Disc", "6 Gears", "Flat");
        Exception exception = assertThrows(ItemNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    //seating is inactive
    @Test
    void testCalculateTotalPrice_InactiveItem() {
        Cycle cycle = new Cycle("ATLAS", "Inactive", "Spokes", "Steel",
                "Aero", "Disc", "6 Gears", "Flat");
        Exception exception = assertThrows(ItemNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

}