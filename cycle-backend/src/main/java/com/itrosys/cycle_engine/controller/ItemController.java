package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.ItemRequest;
import com.itrosys.cycle_engine.dto.ItemResponse;

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


    @Operation(summary = "Get Items by Brand Name", description = "Fetch all items belonging to a specific brand")
    @GetMapping("/brand/{brandName}")
    public ResponseEntity<List<ItemResponse>> getItemsByBrandName(@PathVariable String brandName) {
        return new ResponseEntity<>(itemService.getItemsByBrandName(brandName), HttpStatus.OK);
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


    @Operation(summary = "Delete Item by ID", description = "Remove an item from the system by its ID",
            security = @SecurityRequirement(name = "basicAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteItemById(@PathVariable int id) {

        return new ResponseEntity<>(itemService.deleteById(id), HttpStatus.OK);
    }

    @Operation(summary = "Delete Item by ID", description = "Remove an item from the system by its ID",
            security = @SecurityRequirement(name = "basicAuth"))
    @DeleteMapping("/confirm/delete/{id}")
    public ResponseEntity<String> conformDeleteItemById(@PathVariable int id) {
        itemService.deleteItemById(id);
        return new ResponseEntity<>("Item Deleted successfully", HttpStatus.OK);
    }

}