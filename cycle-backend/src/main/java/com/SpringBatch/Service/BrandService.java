package com.SpringBatch.Service;

import com.SpringBatch.Entity.Brand;
import com.SpringBatch.Entity.IsActiveStatus;
import com.SpringBatch.Repo.BrandRepository;
import com.SpringBatch.exception.BrandNotFound;
import com.SpringBatch.exception.ItemNotFound;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class BrandService {


    private BrandRepository brandRepository;


    public BrandService(BrandRepository brandRepository){
        this.brandRepository = brandRepository;
    }
    public List<Brand> getAllBrands() {
        List<Brand> allBrands = brandRepository.findAll();

        // Filter only active brands
        return allBrands.stream()
                .filter(brand -> brand.getIsActive() == IsActiveStatus.Y)
                .collect(Collectors.toList());
    }


    public Brand getBrandById(int id) {
        return brandRepository.findById(id)
                .filter(brand -> brand.getIsActive() == IsActiveStatus.Y) // Check if active
                .orElseThrow(() -> new BrandNotFound("Brand Not Found or Inactive"));
    }

    //by name
    public List<Brand> searchBrandsByName(String name) {
        return brandRepository.searchActiveBrandsByName(name);
    }
    public Brand createBrand(Brand brand) {
        // Check if the brand name already exists
        if (brandRepository.existsByBrandName(brand.getBrandName())) {
            throw new RuntimeException("Brand with name '" + brand.getBrandName() + "' already exists.");
        }
        return brandRepository.save(brand);
    }


    public void deleteBrand(int id) {
        Brand bid = brandRepository.findById(id).orElseThrow(()-> new RuntimeException("Brand Not Found"));
        bid.setIsActive(IsActiveStatus.N);
        brandRepository.save(bid);

        }



    public Brand updateBrand(int id, Brand brandDetails) {
        // Fetch existing brand

        //checck state first before updating
        Brand existingBrand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand not found with id: " + id));

        // Update brand details
        existingBrand.setBrandName(brandDetails.getBrandName());
        existingBrand.setIsActive(brandDetails.getIsActive());
        existingBrand.setModifiedBy(brandDetails.getModifiedBy());

        // Save and return updated brand
        return brandRepository.save(existingBrand);
    }

}
