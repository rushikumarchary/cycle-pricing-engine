package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.ItemRequest;
import com.itrosys.cycle_engine.dto.ItemResponse;
import com.itrosys.cycle_engine.entity.Item;
import com.itrosys.cycle_engine.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/item")
@Tag(name = "Item Controller", description = "APIs related to Item Management")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(summary = "Get Item by ID", description = "Fetch item details by its ID")
    @GetMapping("/itemId/{id}")
    public ResponseEntity<ItemResponse> getItemById(@PathVariable int id) {
        return new ResponseEntity<>(itemService.getItemById(id), HttpStatus.FOUND);
    }

    @Operation(summary = "Get Items by Brand Name", description = "Fetch all items belonging to a specific brand")
    @GetMapping("/brand/{brandName}")
    public ResponseEntity<List<ItemResponse>> getItemsByBrandName(@PathVariable String brandName) {
        return new ResponseEntity<>(itemService.getItemsByBrandName(brandName), HttpStatus.OK);
    }


    @Operation(summary = "Get Items by Type", description = "Fetch all items of a specific type")
    @GetMapping("/itemType")
    public ResponseEntity<List<ItemResponse>> getItemsByType(@RequestParam String type, @RequestParam int brandId) {
        return ResponseEntity.ok(itemService.getItemsByType(type, brandId));
    }

    @Operation(summary = "Add a New Item", description = "Create a new item in the system")
    @PostMapping("/add")
    public ResponseEntity<ItemResponse> addItem(@RequestBody ItemRequest itemRequest) {
        return new ResponseEntity<>(itemService.addItem(itemRequest), HttpStatus.CREATED);
    }

    @Operation(summary = "Update Item Price and Valid Date",
            description = "Update the price and valid date of an item by its ID")
    @PatchMapping("/update/date-and-price")
    public ResponseEntity<ItemResponse> updateItemDetails(@RequestParam int itemId,
                                                          @RequestParam String validTo,
                                                          @RequestParam BigDecimal price) {
        return new ResponseEntity<>(itemService.updateItemDetails(itemId, validTo, price), HttpStatus.OK);
    }


    @Operation(summary = "Update Item Price", description = "Update the price of an item by its ID")
    @PatchMapping("/update/price")
    public ResponseEntity<ItemResponse> updateItemPrice(@RequestParam int itemId, @RequestParam BigDecimal price) {
        return new ResponseEntity<>(itemService.updateItemPrice(itemId, price), HttpStatus.ACCEPTED);
    }

    @Operation(summary = "Update Item valid Date and Time",
            description = "Update the valid date of an item by its ID",
            security = @SecurityRequirement(name = "basicAuth"))
    @PatchMapping("/update/date-time")
    public ResponseEntity<ItemResponse> updateItemValidDateTime(@RequestParam int itemId, @RequestParam String validTo) {
        return new ResponseEntity<>(itemService.updateValidDate(validTo, itemId), HttpStatus.CREATED);
    }


    @Operation(summary = "Make Item Active", description = "Make the Activate the item by its ID if associated brand is active",
            security = @SecurityRequirement(name = "basicAuth"))
    @PatchMapping("/update/item-active/{itemId}")
    public ResponseEntity<ItemResponse> makeItemActive(@PathVariable int itemId) {
        return ResponseEntity.ok(itemService.makeItemActive(itemId));
    }

    @Operation(summary = "Delete Item by ID", description = "Remove an item from the system by its ID",
            security = @SecurityRequirement(name = "basicAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Item> deleteItemById(@PathVariable int id) {

        return new ResponseEntity<>(itemService.deleteById(id), HttpStatus.OK);
    }

}