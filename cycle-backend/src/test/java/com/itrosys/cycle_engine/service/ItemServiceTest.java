package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.ItemRequest;
import com.itrosys.cycle_engine.dto.ItemResponse;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.InvalidDateFormat;
import com.itrosys.cycle_engine.exception.ItemNotFound;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ItemServiceTest {

    private final ItemService itemService;
    @MockitoBean// Mock JWTService to avoid security dependency issues
    private JWTService jwtService;

    @Autowired
    public ItemServiceTest(ItemService itemService) {
        this.itemService = itemService;
    }

    // this is getItemBy Id test Cases
    @Test
    void getItemById_Success() {
        ItemResponse response = itemService.getItemById(1);
        assertNotNull(response);
        assertEquals(1, response.getItemId());
        assertEquals("Steel", response.getItemName());
        System.out.println("Test Passed  " + response);

    }


    @Test
    void getItemById_itemNotFound() {
        Exception ex = assertThrows(ItemNotFound.class, () -> itemService.getItemById(400));
        System.out.println("test Passed " + ex.getMessage());
    }

    //        This is getItemsByBrandName method test cases
    @Test
    void getItemsByBrandName_Success() {
        String brandName = "AVON";
        List<ItemResponse> items = itemService.getItemsByBrandName(brandName);
        assertNotNull(items);
        assertFalse(items.isEmpty());
        System.out.println("Test Passed: Items found for brand " + brandName);
        items.forEach(item -> System.out.println("Item: " + item.getItemName()));
    }

    @Test
    void getItemsByBrandName_BrandNotFound() {
        String brandName = "TATA";
        Exception ex = assertThrows(BrandNotFound.class, () -> itemService.getItemsByBrandName(brandName));
        System.out.println("Test Passed: " + ex.getMessage());

    }

    @Test
    void getItemsByBrandName_BrandInactive() {
        String brandName = "GIANT";

        Exception ex = assertThrows(BrandNotFound.class, () -> itemService.getItemsByBrandName(brandName));
        System.out.println("Test Passed: " + ex.getMessage());

    }

    @Test
    void getItemsByBrandName_NoItemsFound() {
        String brandName = "SONY";
        Exception ex = assertThrows(ItemNotFound.class, () -> itemService.getItemsByBrandName(brandName));
        System.out.println("Test Passed: " + ex.getMessage());
    }

    @Test
    void getItemsByBrandName_NoActiveItems() {
        String brandName = "SCHWINN";
        Exception ex = assertThrows(ItemNotFound.class, () -> itemService.getItemsByBrandName(brandName));
        System.out.println("Test Passed: " + ex.getMessage());

    }

    //    This is getItemByType method test cases
    @Test
    void getItemsByType_Success() {
        List<ItemResponse> items = itemService.getItemsByType("Frame", 1);
        assertNotNull(items);
        assertFalse(items.isEmpty());
        System.out.println(" Test Passed: Found " + items.size() + " items of type 'Frame'");
    }

    @Test
    void getItemsByType_ItemTypeNotFound() {
        Exception exception = assertThrows(ItemNotFound.class, () -> itemService.getItemsByType("Disc", 1));
        System.out.println(" Test Passed: " + exception.getMessage());
    }

    //Make the Item Active
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void makeItemActive_Success() {
        ItemResponse response = itemService.makeItemActive(42);
        assertNotNull(response);
        System.out.println("Test Passed: Item activated successfully.");
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void makeItemActive_ItemNotFound() {
        Exception ex = assertThrows(ItemNotFound.class, () -> itemService.makeItemActive(444));
        System.out.println("Test Passed : " + ex.getMessage());
    }



    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void makeItemActive_ItemAlreadyActive() {
        Exception exception = assertThrows(ItemNotFound.class, () -> itemService.makeItemActive(8));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void deleteItemById_Success() {
        assertDoesNotThrow(() -> itemService.deleteItemById(8));
        System.out.println("Test Passed: Item deleted successfully.");
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void deleteItemById_ItemNotFound() {
        Exception exception = assertThrows(ItemNotFound.class, () -> itemService.deleteItemById(1400));
        System.out.println("Test Passed: " + exception.getMessage());
    }



    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void updateItemPrice_Success() {
        ItemResponse response = itemService.updateItemPrice(1, new BigDecimal("999.99"));
        assertNotNull(response);
        assertEquals("Item Update Successfully.", response.getMessage());
        System.out.println("Test Passed: Item price updated successfully.");
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void updateItemPrice_ItemNotFound() {
        ItemNotFound itemNotFound = assertThrows(ItemNotFound.class, () -> itemService.updateItemPrice(444, new BigDecimal("999.99")));
        System.out.println("Test Passed: " + itemNotFound.getMessage());
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void updateValidDate_Success() {
        ItemResponse response = itemService.updateValidDate("2025-04-21 23:59:59", 1);
        assertNotNull(response);
        assertEquals("Item Valid Date and Time Updated Successfully.", response.getMessage());
        System.out.println("Test Passed: Item valid date updated successfully.");
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void updateValidDate_ItemNotFound() {
        Exception exception = assertThrows(ItemNotFound.class, () -> itemService.updateValidDate("2025-04-21 23:59:59", 444));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void updateValidDate_InvalidDateFormat() {
        Exception exception = assertThrows(InvalidDateFormat.class, () -> itemService.updateValidDate("2025-12-31", 2));
        System.out.println("Test Passed: " + exception.getMessage());
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testAddItemWithValidData() {
        ItemRequest request = new ItemRequest("Bike", "Cycle",
                new BigDecimal("15000.0"), "2025-04-16 23:59:59", "ATLAS");

        ItemResponse response = itemService.addItem(request);

        assertNotNull(response);
        assertEquals("Item Add Successfully.", response.getMessage());
    }

    @Test
    void testAddItemWithBlankName() {
        ItemRequest request = new ItemRequest("", "Cycle", new BigDecimal("15000.0"), "2025-04-16 23:59:59", "ATLAS");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> itemService.addItem(request));
        assertEquals("Item name cannot be blank", exception.getMessage());
    }

    @Test
    void testAddItemWithBlankItemType() {
        ItemRequest request = new ItemRequest("Bike", "", new BigDecimal("15000.0"), "2025-04-16 23:59:59", "ATLAS");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> itemService.addItem(request));
        assertEquals("Item type cannot be blank", exception.getMessage());
    }

    @Test
    void testAddItemWithNullPrice() {
        ItemRequest request = new ItemRequest("Bike", "Cycle", null, "2025-04-16 23:59:59", "ATLAS");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> itemService.addItem(request));
        assertEquals("Price cannot be null", exception.getMessage());
    }

    @Test
    void testAddItemWithBlankBrandName() {
        ItemRequest request = new ItemRequest("Bike", "Cycle",
                new BigDecimal("15000.0"), "2025-04-16 23:59:59", "");

        Exception exception = assertThrows(IllegalArgumentException.class, () -> itemService.addItem(request));
        assertEquals("Brand name cannot be blank", exception.getMessage());
    }
}