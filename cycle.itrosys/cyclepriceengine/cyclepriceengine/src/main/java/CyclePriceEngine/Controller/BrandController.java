package CyclePriceEngine.Controller;
import CyclePriceEngine.DTO.BrandDTO;
import CyclePriceEngine.Entity.Brand;
import CyclePriceEngine.Service.BrandService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/brands")
@Tag(name = "Brand API", description = "Manage brands by adding, retrieving, and deleting brand details.")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    //AddBrand
    @Operation(summary = "Add a new brand", description = "Creates a new brand and returns the saved brand details.")
 @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<BrandDTO> addBrand(@RequestBody BrandDTO brandDTO) {
        BrandDTO savedBrand = brandService.addBrand(brandDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBrand);
    }


    //GetAllBrandNames
    @Operation(summary = "Get all brand names", description = "Retrieves a list of all brand names available in the database.")
    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllBrandNames() {
        List<String> brandNames = brandService.getAllBrandNames();
        return ResponseEntity.ok(brandNames);
    }

    //getBrandById
    @Operation(summary = "Get brand by ID", description = "Retrieves brand details based on the given brand ID.")
    @GetMapping("/{id}")
    public ResponseEntity<BrandDTO> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));

    }


//GetBrandByName
    @Operation(summary = "Get brand by name", description = "Retrieves brand details based on the given brand name.")
    @GetMapping("/name/{brandName}")
    public ResponseEntity<BrandDTO> getBrandByName(@PathVariable String brandName) {
        BrandDTO brand = brandService.getBrandByName(brandName);
        return ResponseEntity.ok(brand);
    }

//UpdateBrand
    @Operation(summary = "Update a brand", description = "Updates an existing brand's details using its ID.")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BrandDTO> updateBrand(
            @PathVariable Long id,
            @RequestBody BrandDTO brandDTO) {

        BrandDTO updatedBrand = brandService.updateBrand(id, brandDTO);
        return ResponseEntity.ok(updatedBrand);
    }

//DeleteBrandById
    @Operation(summary = "Delete a brand by ID", description = "Deletes a brand based on the given brand ID.")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBrandById(@PathVariable Long id) {
        brandService.deleteBrandById(id);
        return ResponseEntity.ok("Brand deleted successfully.");
    }
}
