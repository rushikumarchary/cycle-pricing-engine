package com.itrosys.cycle_engine.service;


import com.itrosys.cycle_engine.dto.BrandResponse;
import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.entity.Item;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.DuplicateBrand;
import com.itrosys.cycle_engine.repository.BrandRepository;
import com.itrosys.cycle_engine.repository.ItemRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

   private final BrandRepository brandRepository;
   private final ItemRepository itemRepository;


    public BrandService(BrandRepository brandRepository, ItemRepository itemRepository) {
        this.brandRepository = brandRepository;
        this.itemRepository = itemRepository;
    }

    public BrandResponse getBrand(int id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with ID " + id + " is not found"));

        if (brand.getIsActive() == IsActive.N) {
            throw new BrandNotFound("Brand with ID " + id + " is not found ");
        }
        return BrandResponse.builder()
                .message("Brand find Successfully")
                .id(brand.getBrandId())
                .name(brand.getBrandName())
                .build();
    }


    public List<BrandResponse> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        brands = brands.stream()
                .filter(brand -> brand.getIsActive() == IsActive.Y)
                .toList();

        return brands.stream()
                .map(brand -> BrandResponse.builder()
                        .id(brand.getBrandId())
                        .name(brand.getBrandName())
                        .build())
                .toList();
    }

    public BrandResponse getBrandByName(String brandName) {

        Brand brand = brandRepository.findByBrandName(brandName)
                .orElseThrow(() -> new BrandNotFound("Brand with Name " + brandName + " not found"));

        if (brand.getIsActive() == IsActive.N) {
            throw new BrandNotFound("Brand with brandName " + brandName + " is not found ");
        }

        return BrandResponse.builder()
                .id(brand.getBrandId())
                .name(brand.getBrandName())
                .build();
    }

    // Create a new Brand
    public BrandResponse addBrand(String brandName) {
        // Find brand by name
        Optional<Brand> existingBrandOptional = brandRepository.findByBrandName(brandName);

        // Get logged-in user
        String loggedInUsername = getLoggedInUsername();
//        Check the brand present in database
        if (existingBrandOptional.isPresent()) {
            Brand existingBrand = existingBrandOptional.get();

//         here check brand is active if is active state then we not save that brand again
            if (existingBrand.getIsActive() == IsActive.Y) {
                throw new DuplicateBrand("Brand with name '" + brandName + "' already exists.");
            } else {
                // Reactivate brand if brand is inActive state
                existingBrand.setIsActive(IsActive.Y);
                existingBrand.setModifiedBy(loggedInUsername);
                Brand updatedBrand = brandRepository.save(existingBrand);

                return BrandResponse.builder()
                        .message("Brand reactivated successfully.")
                        .name(updatedBrand.getBrandName())
                        .id(updatedBrand.getBrandId())
                        .build();
            }
        }

        // If brand does not exist, create a new one
        Brand newBrand = new Brand();
        newBrand.setBrandName(brandName);
        newBrand.setIsActive(IsActive.Y); // Set as active Y
        newBrand.setModifiedBy(loggedInUsername); // Set modifiedBy

        Brand savedBrand = brandRepository.save(newBrand);

        return BrandResponse.builder()
                .message("Brand added successfully.")
                .name(savedBrand.getBrandName())
                .id(savedBrand.getBrandId())
                .build();
    }


    // Delete a Brand by id
    public BrandResponse deleteBrandById(int id) {
        // Fetch brand from DB or throw exception
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with ID " + id + " not found."));

        // Get logged-in user
        String loggedInUsername = getLoggedInUsername();

        // Set brand as inactive instead of deleting
        brand.setIsActive(IsActive.N);
        brand.setModifiedBy(loggedInUsername);
        brandRepository.save(brand);  // Save updated brand

        // Fetch all items linked to this brand
        List<Item> items = itemRepository.findByBrand(brand);
//
        // Check if items exist before updating
        if (!items.isEmpty()) {
            for (Item item : items) {
                item.setIsActive(IsActive.N);  // Deactivate N
                item.setModifiedBy(loggedInUsername);
            }
            // Save all updated items
            itemRepository.saveAll(items);
        }
        return BrandResponse.builder()
                .message("Brand deleted successfully.")
                .name(brand.getBrandName())
                .id(brand.getBrandId())
                .build();
    }


    public BrandResponse updateBrandName(int id, String newBrandName) {

        // Find brand by ID
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with ID " + id + " not found."));

        // If the brand name is already the same for the given ID, throw an exception
        if (brand.getBrandName().equals(newBrandName)) {
            throw new DuplicateBrand("Brand is already updated with the same name.");
        }

        // Check if another brand (different ID) already has the same name
        Optional<Brand> existingBrand = brandRepository.findByBrandName(newBrandName);
        if (existingBrand.isPresent() && existingBrand.get().getBrandId() != id) {
            throw new DuplicateBrand("Brand name '" + newBrandName + "' is already present with ID " + existingBrand.get().getBrandId() + ".");
        }

        // Update brand name and set modified by the current user
        brand.setBrandName(newBrandName);
        brand.setModifiedBy(getLoggedInUsername());

        // Save updated brand
        Brand updatedBrand = brandRepository.save(brand);

        return BrandResponse.builder()
                .message("Brand name updated successfully.")
                .id(updatedBrand.getBrandId())
                .name(updatedBrand.getBrandName())
                .build();
    }


    // Helper method to get the logged-in username
    private String getLoggedInUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userDetails.getUsername();
        } else {
            return principal.toString();
        }
    }


    public BrandResponse makeBrandActive(int id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with id " + id + " not found"));

            brand.setIsActive(IsActive.N);
            brand.setModifiedBy(getLoggedInUsername());
        Brand savedBrand = brandRepository.save(brand);

        return BrandResponse.builder()
                .message("Brand Activated Successfully")
                .id(savedBrand.getBrandId())
                .name(savedBrand.getBrandName())
                .build();
    }
}
