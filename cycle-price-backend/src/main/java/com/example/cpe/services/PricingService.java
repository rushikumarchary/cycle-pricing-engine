package com.example.cpe.services;

import java.util.Date;
import java.util.List;
import java.util.Map;


import com.example.cpe.dto.BrandResponse;


public interface PricingService {
    Map<String, Object> calculatePrice(Map<String, Map<String, Object>> cycleConfig, Date pricingDate);
    public List<BrandResponse> getAllBrandsForCycle();
    public List<BrandResponse> getAllBrands();
    public Map<String, List<Map<String, Object>>> getGroupedItemNameAndTypeByBrandName(int id);
}
