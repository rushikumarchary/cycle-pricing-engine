package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.PostalMetadata;
import lombok.Data;

@Data
public class PostalMetadataDTO {
    private Long id;
    private String branchType;
    private String deliveryStatus;
    private String circle;
    private String district;
    private String division;
    private String region;
    private String country;

    public static PostalMetadataDTO fromEntity(PostalMetadata metadata) {
        if (metadata == null) {
            return null;
        }
        PostalMetadataDTO dto = new PostalMetadataDTO();
        dto.setId(metadata.getId());
        dto.setBranchType(metadata.getBranchType());
        dto.setDeliveryStatus(metadata.getDeliveryStatus());
        dto.setCircle(metadata.getCircle());
        dto.setDistrict(metadata.getDistrict());
        dto.setDivision(metadata.getDivision());
        dto.setRegion(metadata.getRegion());
        dto.setCountry(metadata.getCountry());
        return dto;
    }
} 