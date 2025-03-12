package com.example.cpe.services.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cpe.config.SecurityUtil;
import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;
import com.example.cpe.exception.BrandNotFound;
import com.example.cpe.exception.DuplicateBrand;
import com.example.cpe.repository.BrandRepository;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.BrandService;

@Service
public class BrandServiceImpl implements BrandService {

	   final private BrandRepository brandRepository;
	    final private ItemRepository itemRepository;

	    public BrandServiceImpl(BrandRepository brandRepository,ItemRepository itemRepository) {
	        this.brandRepository = brandRepository;
	        this.itemRepository=itemRepository;
	    }

    // Get all active brand
    @Override
    public List<Brands> getAllBrands() {
        return brandRepository.findAllActiveBrands();
    }


    // Create a new brand or reactivate an inactive brand
    @Override
    public String createBrand(String brandName) {
        Optional<Brands> existingBrand = brandRepository.findByBrandName(brandName);
        String currentUser = SecurityUtil.getLoggedInUsername(); // Get logged-in username

        if (existingBrand.isPresent()) {
            Brands brand = existingBrand.get();
            
            if (ActiveStatus.Y.equals(brand.getIsActive())) {
                throw new DuplicateBrand("Brand with name '" + brandName + "' already exists.");
                
            }
        }

        // Create a new brand if it doesn't exist
        Brands newBrand = new Brands();
        newBrand.setBrandName(brandName);
        newBrand.setIsActive(ActiveStatus.Y); // Set brand as active
        newBrand.setModifiedBy(currentUser);

        brandRepository.save(newBrand);

        return "Brand added successfully.";
    }

    // Get brand by ID with active status check
    @Override
    public Brands getBrandById(Integer id) {
        Brands brands = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with ID " + id + " is not found"));

        if ( ActiveStatus.N.equals(brands.getIsActive())) {
            throw new BrandNotFound("Brand with ID " + id + " is inactive");
        }
        return brands;
    }

    // Update brand name with validation
    @Override
    public Brands updateBrand(Integer id, String newBrandName) {
        Brands brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with ID " + id + " is not found."));

        Optional<Brands> existingBrand = brandRepository.findByBrandName(newBrandName);

        if (existingBrand.isPresent()) {
            Brands foundBrand = existingBrand.get();

            if (ActiveStatus.Y.equals(foundBrand.getIsActive())) {
                throw new DuplicateBrand("Brand name '" + newBrandName + "' already exists and is active.");
            }

            if (ActiveStatus.N.equals(foundBrand.getIsActive())) {
                foundBrand.setIsActive(ActiveStatus.Y);
                foundBrand.setModifiedBy(SecurityUtil.getLoggedInUsername());
                foundBrand.setBrandName(newBrandName);

                return brandRepository.save(foundBrand); //Reactivated and Updated Brand
            }
        }

        brand.setBrandName(newBrandName);
        brand.setModifiedBy(SecurityUtil.getLoggedInUsername());

        return brandRepository.save(brand);
    }


    // Soft delete brand by setting isActive to 'N' and deactivate related items
    @Override
    public void deleteBrand(Integer id) {
        Brands brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with ID " + id + " not found."));

        String loggedInUsername = SecurityUtil.getLoggedInUsername();

        brand.setIsActive(ActiveStatus.N); // Soft delete the brand
        brand.setModifiedBy(loggedInUsername);
        brandRepository.save(brand);
    }
}
