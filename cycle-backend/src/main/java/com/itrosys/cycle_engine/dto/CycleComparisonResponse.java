package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.enums.VariantType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CycleComparisonResponse {
    private Long id;
    private UserResponse user;
    private CartResponse cart;
    private VariantType variant;
    private List<ItemComparison> itemDetails;
    private PriceBreakdown priceBreakdown;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserResponse {
        private Long id;
        private String name;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class CartResponse {
    	private String brand;
        private Long cartId;
        private int quantity;
        private String thumbnail;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ItemComparison {
        private String itemName;     
        private String itemType;     
        private BigDecimal price;        
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class PriceBreakdown {
        private double totalPartsPrice; 
        private double gst;               
        private double finalPrice;        
    }
}
