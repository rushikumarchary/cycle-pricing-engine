package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.BrandResponse;
import com.itrosys.cycle_engine.dto.Cycle;
import com.itrosys.cycle_engine.dto.CycleResponse;
import com.itrosys.cycle_engine.service.CycleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cycle")
@Tag(name = "Cycle Controller", description = "APIs related to Cycle Management")
public class CycleController {

    private final CycleService cycleService;

    public CycleController(CycleService cycleService) {
        this.cycleService = cycleService;

    }

    @Operation(summary = "Get all brand names", description = "Fetches all available brand names")
    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> getAllBrandNames() {
        return new ResponseEntity<>(cycleService.getAllBrandsForCycle(), HttpStatus.OK);
    }

    @Operation(summary = "Get Item Types and Names by Brand",
            description = "Fetch item types with associated item names for a given brand")
    @GetMapping("/byBrand/{id}")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getGroupedItemNameAndTypeByBrand(@PathVariable int id) {
        return  ResponseEntity.ok(cycleService.getGroupedItemNameAndTypeByBrandName(id));
    }

    @Operation(summary = "Calculate Cycle Price",
            description = "Calculate the total price of a cycle based on its configuration")
    @PostMapping("/calculate-price")
    public ResponseEntity<CycleResponse> calculatePrice(@RequestBody Cycle cycle) {
        CycleResponse response = cycleService.calculateTotalPrice(cycle);
        return ResponseEntity.ok(response);
    }


}
