package com.example.cpe.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.example.cpe.entities.Brands;
import com.example.cpe.exception.BrandNotFound;
import com.example.cpe.exception.DuplicateBrand;
import com.example.cpe.repository.BrandRepository;
import com.example.cpe.services.BrandService;
import com.example.cpe.services.ItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/brands")
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Brand Controller", description = "Manage cycle brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @Autowired
    private BrandRepository brandRepository;

    @GetMapping("/getAllBrands")
    @Operation(summary = "Get all brands", description = "Fetch the list of all cycle brands")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully fetched all brands")
    })
    public List<Brands> getAllBrands() {
        return brandService.getAllBrands();
    }

    @PostMapping("/add/{brandName}")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Add a new brand", description = "Create a new cycle brand")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand created successfully"),
            @ApiResponse(responseCode = "409", description = "Brand already exists")
    })
    public ResponseEntity<String> createBrand(@PathVariable("brandName") String brandName) {
        String response = brandService.createBrand(brandName);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get brand by ID", description = "Fetch brand details by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand found"),
            @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    public ResponseEntity<Brands> getBrandById(
            @Parameter(description = "Brand ID to fetch") @PathVariable("id") Integer id) {
        Brands brand = brandService.getBrandById(id);
        return brand != null ? ResponseEntity.ok(brand) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
   // @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update brand", description = "Update existing brand details")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand updated successfully"),
            @ApiResponse(responseCode = "404", description = "Brand not found"),
            @ApiResponse(responseCode = "409", description = "Duplicate brand name")
    })
    public ResponseEntity<String> updateBrand(
            @Parameter(description = "Brand ID to update") @PathVariable("id") Integer id,
            @RequestBody Brands brandDetails) {
        try {
            Brands updatedBrand = brandService.updateBrand(id, brandDetails.getBrandName());
            return ResponseEntity.ok("Brand '" + updatedBrand.getBrandName() + "' updated successfully.");
        } catch (BrandNotFound e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (DuplicateBrand e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the brand.");
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Delete brand", description = "Soft delete a brand by setting isActive='N'")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Brand deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Brand not found")
    })
    public ResponseEntity<String> deleteBrand(
            @Parameter(description = "Brand ID to delete") @PathVariable("id") Integer id) {
        Optional<Brands> brand = brandRepository.findById(id);
        if (brand.isPresent()) {
            brandService.deleteBrand(id);
            return ResponseEntity.ok(
                    "Brand '" + brand.get().getBrandName() + "' deleted successfully and isActive state is set to: N");
        }
        return ResponseEntity.notFound().build();
    }
}
