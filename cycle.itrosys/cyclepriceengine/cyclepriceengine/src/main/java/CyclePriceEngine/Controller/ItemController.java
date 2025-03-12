package CyclePriceEngine.Controller;
import CyclePriceEngine.DTO.ItemWithBrandDTO;
import CyclePriceEngine.Entity.Item;
import CyclePriceEngine.Service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import CyclePriceEngine.DTO.ItemDTO;
import java.util.Optional;

@RestController
@RequestMapping("/items")
@Tag(name = "Cycle Pricing", description = "Operations related to cycle pricing")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(summary = "Get items by type", description = "Fetches items based on their type")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<ItemDTO>> getItemsByType(@PathVariable String type) {
        List<ItemDTO> items = itemService.getItemsByType(type);
        return items.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(items);
    }

    @Operation(summary = "Get items by brand name", description = "Fetches items by their brand name")
    @GetMapping("/brand/name/{brandName}")
    public ResponseEntity<?> getItemsByBrandName(@PathVariable String brandName) {
        List<ItemDTO> items = itemService.getItemsByBrandName(brandName);
        return items.isEmpty()
                ? ResponseEntity.status(HttpStatus.NOT_FOUND).body("No items found for the brand: " + brandName)
                : ResponseEntity.ok(items);
    }

    @Operation(summary = "Update an item", description = "Updates an item’s details using its ID")
    @PutMapping("/{itemId}")
    public ResponseEntity<ItemDTO> updateItem(
            @Parameter(description = "ID of the item to update") @PathVariable Long itemId,
            @RequestBody ItemDTO updatedItemDTO) {
        updatedItemDTO.setUpdatedBy(updatedItemDTO.getUpdatedBy()); // Replace with actual user if available
        return ResponseEntity.ok(itemService.updateItem(itemId, updatedItemDTO));
    }

    @Operation(summary = "Get grouped item names and types by brand", description = "Fetches item names and types grouped by brand ID")
    @GetMapping("/grouped/{brandId}")
    public ResponseEntity<Map<String, List<String>>> getGroupedItemNameAndTypeByBrand(@PathVariable Long brandId) {
        return ResponseEntity.ok(itemService.getGroupedItemNameAndTypeByBrand(brandId));
    }

    @Operation(summary = "Get all items", description = "Fetches all available items")
    @GetMapping("/getallitems")
 public ResponseEntity<List<ItemDTO>> getAllItems() {
       return ResponseEntity.ok(itemService.getAllItems());
 }


    @Operation(summary = "Get all items with their brands", description = "Fetches all items along with their brand details")
    @GetMapping("/items-with-brands")
    public ResponseEntity<?> getAllItemsAlongWithBrands() {
        List<ItemWithBrandDTO> items = itemService.getAllItemsWithBrands();
        return items.isEmpty() ? ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList()) : ResponseEntity.ok(items);
    }

    @Operation(summary = "Get item by ID", description = "Fetches an item using its ID")
    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> getItemById(@PathVariable Long id) {
        return itemService.getItemById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete an item", description = "Deletes an item using its ID (Admin/Manager only)")
    @DeleteMapping("/delete/{id}")
   @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<String> deleteItemById(@PathVariable Long id) {
        itemService.deleteItemById(id);
        return ResponseEntity.ok("Item deleted successfully.");
    }
}
