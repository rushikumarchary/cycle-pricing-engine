package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.PostalMetadata;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostalMetadataResponse {
    private String branchType;
    private String deliveryStatus;
    private String circle;
    private String district;
    private String division;
    private String region;
    private String country;

    public static PostalMetadataResponse fromEntity(PostalMetadata postalMetadata) {
        return PostalMetadataResponse.builder()
                .branchType(postalMetadata.getBranchType())
                .deliveryStatus(postalMetadata.getDeliveryStatus())
                .circle(postalMetadata.getCircle())
                .district(postalMetadata.getDistrict())
                .division(postalMetadata.getDivision())
                .region(postalMetadata.getRegion())
                .country(postalMetadata.getCountry())
                .build();
    }

    public static List<PostalMetadataResponse> fromEntityList(List<PostalMetadata> postalMetadataList) {
        return postalMetadataList.stream()
                .map(PostalMetadataResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
