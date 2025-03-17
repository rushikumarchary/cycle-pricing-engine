package com.SpringBatch.Controller;

import com.SpringBatch.Entity.Brand;
import com.SpringBatch.Service.BrandService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@Tag(name = "Brand Controller", description = "API's used in Brand Controller")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Brand> getBrandById(@PathVariable("id") int id) {
        Brand brand = brandService.getBrandById(id);
        return brand != null ? ResponseEntity.ok(brand) : ResponseEntity.notFound().build();
    }


    @PostMapping
    public ResponseEntity<Brand> createBrand(@RequestBody Brand brand) {
        Brand savedBrand = brandService.createBrand(brand);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBrand);
    }


	@PutMapping("/{id}")
    public Brand UpdateBrand(@PathVariable("id") int id, @RequestBody Brand brandDetails) {
        Brand brand = brandService.updateBrand(id, brandDetails);
        return brand;
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBrand(@PathVariable("id") int id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok("Brand with ID " + id + " deleted successfully.");
    }


    //search by name

    @GetMapping("/search")
    public ResponseEntity<List<Brand>> searchBrands(@RequestParam String name) {
        List<Brand> brands = brandService.searchBrandsByName(name);
        return brands.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(brands);
    }

}
