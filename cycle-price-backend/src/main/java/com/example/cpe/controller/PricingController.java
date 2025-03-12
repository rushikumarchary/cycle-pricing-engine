package com.example.cpe.controller;

import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.cpe.services.PricingService;

@RestController
@RequestMapping("/calculateprice")
public class PricingController {

    @Autowired
    private PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @PostMapping
    public Map<String, Object> calculateCyclePrice(@RequestBody Map<String, Map<String, Object>> cycleConfig) {
        return pricingService.calculatePrice(cycleConfig, new Date());
    }
}
