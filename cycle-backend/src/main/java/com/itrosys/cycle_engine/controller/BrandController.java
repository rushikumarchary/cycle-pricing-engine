package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.BrandResponse;
import com.itrosys.cycle_engine.dto.BrandUpdateRequest;
import com.itrosys.cycle_engine.service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brand")
@Tag(name = "Brand Controller", description = "APIs related to Brand Management")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @Operation(summary = "Get all brand names", description = "Fetches all available brand names")
    @GetMapping("/brands")
    public ResponseEntity<List<BrandResponse>> getAllBrandNames() {
        return new ResponseEntity<>(brandService.getAllBrands(), HttpStatus.OK);
    }


    @Operation(summary = "Add a new brand", description = "Creates a new brand", security = @SecurityRequirement(name = "basicAuth"))
    @PostMapping("/add")
    public ResponseEntity<BrandResponse> addBrand(@RequestParam String name) {
        return new ResponseEntity<>(brandService.addBrand(name), HttpStatus.ACCEPTED);
    }

    @Operation(summary = "Update brand name", description = "Updates the brand name by its ID",
    security = @SecurityRequirement(name = "basicAuth"))
    @PatchMapping("/update")
    public ResponseEntity<BrandResponse> updateBrandName(@RequestBody BrandUpdateRequest request) {
        return ResponseEntity.ok(brandService.updateBrandName(request.getId(), request.getNewBrandName()));
    }


    @Operation(summary = "Delete brand by ID", description = "Removes a brand using its ID", security = @SecurityRequirement(name = "basicAuth"))
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<BrandResponse> deleteBrandById(@PathVariable int id) {
        return new ResponseEntity<>(brandService.deleteBrandById(id), HttpStatus.ACCEPTED);
    }
}

