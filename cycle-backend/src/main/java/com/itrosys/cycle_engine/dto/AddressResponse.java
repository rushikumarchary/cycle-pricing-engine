package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.Address;
import com.itrosys.cycle_engine.enums.AddressType;
import lombok.*;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long addressId;
    private Long userId;
    private String fullName;
    private String mobileNumber;
    private String pinCode;
    private String flatHouseNo;
    private String apartment;
    private String areaStreet;
    private String landmark;
    private String city;
    private String state;
    private AddressType addressType;
    private String deliveryInstructions;
    private PostalMetadataResponse postalMetadata;

    public static AddressResponse fromEntity(Address address) {
        return AddressResponse.builder()
                .addressId(address.getId())
                .userId(address.getUser().getId())
                .fullName(address.getFullName())
                .mobileNumber(address.getMobileNumber())
                .pinCode(address.getPinCode())
                .flatHouseNo(address.getFlatHouseNo())
                .apartment(address.getApartment())
                .areaStreet(address.getAreaStreet())
                .landmark(address.getLandmark())
                .city(address.getCity())
                .state(address.getState())
                .addressType(address.getAddressType())
                .deliveryInstructions(address.getDeliveryInstructions())
                .postalMetadata(address.getPostalMetadata() != null ? 
                    PostalMetadataResponse.fromEntity(address.getPostalMetadata()) : null)
                .build();
    }

    public static List<AddressResponse> fromEntityList(List<Address> addresses) {
        return addresses.stream()
                .map(AddressResponse::fromEntity)
                .collect(Collectors.toList());
    }
}