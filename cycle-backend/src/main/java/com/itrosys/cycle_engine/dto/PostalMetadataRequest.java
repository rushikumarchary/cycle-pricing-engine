package com.itrosys.cycle_engine.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostalMetadataRequest {
    private String branchType;
    private String deliveryStatus;
    private String circle;
    private String district;
    private String division;
    private String region;
    private String country;
} 