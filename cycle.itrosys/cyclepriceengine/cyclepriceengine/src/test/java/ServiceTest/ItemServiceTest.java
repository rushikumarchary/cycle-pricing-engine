package ServiceTest;
import CyclePriceEngine.Constants.Status;
import CyclePriceEngine.CyclepriceengineApplication;
import CyclePriceEngine.DTO.ItemDTO;
import CyclePriceEngine.Entity.Brand;
import CyclePriceEngine.Entity.Item;
import CyclePriceEngine.Exception.ItemNotFoundException;
import CyclePriceEngine.Repository.BrandRepository;
import CyclePriceEngine.Repository.ItemRepository;
import CyclePriceEngine.Service.ItemService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = CyclepriceengineApplication.class)
@Transactional  // Ensures database changes are rolled back after each test
public class ItemServiceTest {

    @Autowired
    private ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private BrandRepository brandRepository;

    @BeforeEach
    void setUp() {
        itemRepository.deleteAll(); // Clean up previous data
        brandRepository.deleteAll(); // Clean brands

        // Save a test brand (needed for foreign key reference)
        Brand testBrand = brandRepository.save(
                Brand.builder().brandName("Trek").status(Status.Y).updatedBy("Admin").build()
        );

        // Insert 3 Items
        itemRepository.save(Item.builder()
                .itemName("Road Bike")
                .itemType("Bicycle")
                .price(new BigDecimal("499.99"))
                .status(Status.Y)
                .validTo(LocalDate.now())
                .updatedAt(LocalDateTime.now())
                .updatedBy("Admin")
                .brand(testBrand)
                .build());

        itemRepository.save(Item.builder()
                .itemName("Mountain Bike")
                .itemType("Bicycle")
                .price(new BigDecimal("699.99"))
                .status(Status.Y)
                .validTo(LocalDate.now())
                .updatedAt(LocalDateTime.now())
                .updatedBy("Admin")
                .brand(testBrand)
                .build());

        itemRepository.save(Item.builder()
                .itemName("Hybrid Bike")
                .itemType("Bicycle")
                .price(new BigDecimal("399.99"))
                .status(Status.Y)
                .validTo(LocalDate.now())
                .updatedAt(LocalDateTime.now())
                .updatedBy("Admin")
                .brand(testBrand)
                .build());
    }

    @Test
    void testGetAllItems() {
        List<ItemDTO> items = itemService.getAllItems();

        assertNotNull(items);
        assertEquals(3, items.size()); // Expecting 3 items from setUp()
    }

    @Test
    void testGetItemById() {
        Item existingItem = itemRepository.findByItemName("Road Bike").orElseThrow();
        Optional<ItemDTO> itemDTO = itemService.getItemById(existingItem.getItemId());

        assertTrue(itemDTO.isPresent());
        assertEquals("Road Bike", itemDTO.get().getItemName());
    }

    @Test
    void testUpdateItem() {
        Item existingItem = itemRepository.findByItemName("Mountain Bike").orElseThrow();
        ItemDTO updateDTO = ItemDTO.builder()
                .itemId(existingItem.getItemId())
                .itemName("Updated Mountain Bike")
                .itemType("Bicycle")
                .build();

        ItemDTO updatedItem = itemService.updateItem(existingItem.getItemId(), updateDTO);

        assertNotNull(updatedItem);
        assertEquals("Updated Mountain Bike", updatedItem.getItemName());

        // Verify in DB
        Item itemInDb = itemRepository.findById(existingItem.getItemId()).orElseThrow();
        assertEquals("Updated Mountain Bike", itemInDb.getItemName());
    }

    @Test
    void testGetItemsByType() {
        List<ItemDTO> items = itemService.getItemsByType("Bicycle");

        assertNotNull(items);
        assertEquals(3, items.size());
    }

    @Test
    void testDeleteItemById() {
        Item existingItem = itemRepository.findByItemName("Hybrid Bike").orElseThrow();
        itemService.deleteItemById(existingItem.getItemId());

        assertFalse(itemRepository.existsById(existingItem.getItemId()));
    }

}