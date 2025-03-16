package com.example.cpe.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.cpe.config.SecurityUtil;
import com.example.cpe.dto.ItemRequest;
import com.example.cpe.dto.ItemResponse;
import com.example.cpe.entities.Items;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.ItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/items")
@Tag(name = "Item Controller", description = "Manage cycle items")
public class ItemController {

    @Autowired
    private ItemService itemService;
    
    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    @Operation(summary = "Get all items", description = "Fetch the list of all cycle items")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched all items")
    })
    public List<Items> getAllItems() {
        return itemService.getAllItems();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Add a new item", description = "Create a new item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Item created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ItemResponse> createItem(@RequestBody ItemRequest itemRequest) {
        ItemResponse itemResponse = itemService.createItem(itemRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(itemResponse);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get item by ID", description = "Retrieve an item by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item found"),
            @ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<ItemResponse> getItemById(
            @Parameter(description = "Item ID to fetch") @PathVariable("id") Long id) {
        ItemResponse itemResponse = itemService.getItemById(id);
        return ResponseEntity.ok(itemResponse);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an item", description = "Update an existing item if it is active")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item updated successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<ItemResponse> updateItem(
            @Parameter(description = "Item ID to update") @PathVariable("id") Long id, 
            @RequestBody ItemRequest itemRequest) {
        ItemResponse updatedItem = itemService.updateItem(id, itemRequest);
        return ResponseEntity.ok(updatedItem);
    }

    @Operation(summary = "Update Item Price", description = "Update the price of an item by its ID")
    @PatchMapping("/update/price")
    public ResponseEntity<ItemResponse> updateItemPrice(@RequestParam(name = "itemId") Long itemId, @RequestParam(name = "price") Double price) {
        return new ResponseEntity<>(itemService.updateItemPrice(itemId, price), HttpStatus.ACCEPTED);
    }

    @Operation(summary = "Update Item valid Date and Time",
            description = "Update the valid date of an item by its ID",
            security = @SecurityRequirement(name = "basicAuth"))
    @PatchMapping("/update/date-time")
    public ResponseEntity<ItemResponse> updateItemValidDateTime(@RequestParam(name = "itemId") Long itemId,@RequestParam(name = "validTo") String validTo) {
        return new ResponseEntity<>(itemService.updateValidDate(validTo, itemId), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Delete item", description = "Soft delete an item by setting isActive='N'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Item not found")
    })
    public ResponseEntity<String> deleteItem(
            @Parameter(description = "Item ID to delete") @PathVariable("id") Long id) {
        Optional<Items> item = itemRepository.findById(id);
        if (item.isPresent()) {
            itemService.deleteItem(id);
            return ResponseEntity.ok("Item '" + item.get().getItemName() + "' deleted successfully and isActive state is set to: N by user: " + SecurityUtil.getLoggedInUsername());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/brand/{brandName}")
    @Operation(summary = "Get items by brand", description = "Retrieve all items belonging to a specific brand")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Items found"),
            @ApiResponse(responseCode = "404", description = "Brand not found or no items found")
    })
    public ResponseEntity<List<ItemResponse>> getItemsByBrand(
            @Parameter(description = "Brand name to fetch items") @PathVariable("brandName") String brandName) {
        List<ItemResponse> items = itemService.getItemsByBrand(brandName);
        return ResponseEntity.ok(items);
    }
}
