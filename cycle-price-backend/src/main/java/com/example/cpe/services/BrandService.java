package com.example.cpe.services;

import java.util.List;

import com.example.cpe.entities.Brands;


public interface BrandService {
	
	List<Brands> getAllBrands();
    Brands getBrandById(Integer id);
    void deleteBrand(Integer id);
	String createBrand(String brandName);
	Brands updateBrand(Integer id, String newBrandName);



}
