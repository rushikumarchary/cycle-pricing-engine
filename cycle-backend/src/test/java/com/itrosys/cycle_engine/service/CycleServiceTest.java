package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.BrandResponse;
import com.itrosys.cycle_engine.dto.Cycle;
import com.itrosys.cycle_engine.dto.CycleResponse;
import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.ItemNotFound;
import com.itrosys.cycle_engine.repository.BrandRepository;
import com.itrosys.cycle_engine.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest
@ActiveProfiles("test") // Uses application-test.properties
@Transactional // Rolls back data after each test
class CycleServiceTest {

    @MockitoBean// Mock JWTService to avoid security dependency issues
    private JWTService jwtService;
    @Autowired
    private CycleService cycleService;



    @Test
    void testGetAllBrands() {
        List<BrandResponse> brands = cycleService.getAllBrands();
        assertNotNull(brands);
        assertTrue(brands.size() >= 0);
        System.out.println("testGetAllBrands Passed: " + brands);
    }
    @Test
    void testGetGroupedItemNameAndTypeByBrandName_ValidBrand() {

        // Fetch grouped items
        Map<String, List<Map<String, Object>>> result = cycleService.getGroupedItemNameAndTypeByBrandName(1);

        // Validate results
        assertNotNull(result, "Result should not be null");
        assertFalse(result.isEmpty(), "Result should not be empty");

        // Print output for verification
        System.out.println("Test Result: " + result);
    }


    @Test
    void testGetGroupedItemNameAndTypeByBrandName_BrandNotFound() {
        String brandName = "Tata";
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.getGroupedItemNameAndTypeByBrandName(140));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testGetGroupedItemNameAndTypeByBrandName_InactiveBrand() {

        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.getGroupedItemNameAndTypeByBrandName(2));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testGetGroupedItemNameAndTypeByBrandName_NoItemsFound() {

        Exception exception = assertThrows(ItemNotFound.class, () -> cycleService.getGroupedItemNameAndTypeByBrandName(25));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_Success() {
        Cycle cycle = new Cycle(1, 76, 51, 1,
                36, 61, 81, 16);
        CycleResponse response = cycleService.calculateTotalPrice(cycle);
        assertNotNull(response);
        System.out.println("Test Passed: " + response);
    }
//
    @Test
    void testCalculateTotalPrice_NullParts() {
        Cycle cycle = new Cycle(1, 76, 51, 1,
                36, 0, 81, 16);
        Exception exception = assertThrows(IllegalArgumentException.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_BrandNotFound() {
        Cycle cycle = new Cycle(1117521, 76, 51, 1,
                36, 61, 81, 16);
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_InactiveBrand() {
        Cycle cycle = new Cycle(2, 76, 51, 1,
                36, 61, 81, 16);
        Exception exception = assertThrows(BrandNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    void testCalculateTotalPrice_ItemNotFound() {
        Cycle cycle = new Cycle(1, 76, 51, 1,
                36, 61, 81, 166);
        Exception exception = assertThrows(ItemNotFound.class, () -> cycleService.calculateTotalPrice(cycle));
        System.out.println("Test Passed: " + exception.getMessage());
    }


}