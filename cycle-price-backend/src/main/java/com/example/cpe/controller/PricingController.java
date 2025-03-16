package com.example.cpe.controller;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.cpe.dto.BrandResponse;
import com.example.cpe.services.PricingService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/calculateprice")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }
    @Operation(summary = "Get all brand names", description = "Fetches all available brand names")
    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> getAllBrandNames() {
        return new ResponseEntity<>(pricingService.getAllBrandsForCycle(), HttpStatus.OK);
    }

    @Operation(summary = "Get Item Types and Names by Brand",
            description = "Fetch item types with associated item names for a given brand")
    @GetMapping("/byBrand/{id}")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getGroupedItemNameAndTypeByBrand(@PathVariable("id") int id) {
        return  ResponseEntity.ok(pricingService.getGroupedItemNameAndTypeByBrandName(id));
    }

    @PostMapping
    public Map<String, Object> calculateCyclePrice(@RequestBody Map<String, Map<String, Object>> cycleConfig) {
        return pricingService.calculatePrice(cycleConfig, new Date());
    }
}
