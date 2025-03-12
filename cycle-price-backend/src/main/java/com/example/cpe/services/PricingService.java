package com.example.cpe.services;

import java.util.Date;
import java.util.Map;

import org.springframework.stereotype.Service;


public interface PricingService {
    Map<String, Object> calculatePrice(Map<String, Map<String, Object>> cycleConfig, Date pricingDate);
}
