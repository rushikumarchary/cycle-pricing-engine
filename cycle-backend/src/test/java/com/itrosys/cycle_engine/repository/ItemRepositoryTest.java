package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.entity.Item;
import com.itrosys.cycle_engine.enums.IsActive;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest // Load full Spring context
@ActiveProfiles("test") // Use application-test.properties
@Transactional // Rollback DB changes after each test
class ItemRepositoryTest {

   private final ItemRepository itemRepository;
    @Autowired
   public ItemRepositoryTest(ItemRepository itemRepository){
       this.itemRepository=itemRepository;

   }
    private final IsActive active =IsActive.Y;


    @Test
    void testFindByBrand_WithExistingData() {
        // Create a Brand object with the given details
        Brand brand = new Brand();
        brand.setBrandId(3); // Setting ID explicitly since we're not persisting it
        brand.setBrandName("ATLAS");
        brand.setIsActive(active);
        brand.setModifiedBy("Admin");

        try {
            Date modifiedOn = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                    .parse("2025-03-02 20:02:40");
            brand.setModifiedOn(modifiedOn);
        } catch (ParseException e) {
            fail("Failed to parse modifiedOn date");
        }

        // Fetch items by brand
        List<Item> items = itemRepository.findByBrand(brand);

        // Assertions
        assertNotNull(items, "Item list should not be null");
        assertFalse(items.isEmpty(), "Item list should not be empty");

        // Verify item count based on the provided database data
        assertEquals(18, items.size(), "There should be 5 items linked to brand ID 3");

        // Verify that all items belong to the correct brand
        assertTrue(items.stream().allMatch(item -> item.getBrand().getBrandId() == 3),
                "All items should belong to brand ID 3");

        // Print fetched items for debugging
        items.forEach(item -> System.out.println("Fetched Item: " + item.getItemName()));
    }
}