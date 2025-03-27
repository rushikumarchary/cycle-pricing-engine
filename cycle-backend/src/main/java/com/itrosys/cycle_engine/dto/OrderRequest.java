package com.itrosys.cycle_engine.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private Long addressId;
    private List<Long> cartIds;
    private Double shippingCost;
    private String couponCode;
}
