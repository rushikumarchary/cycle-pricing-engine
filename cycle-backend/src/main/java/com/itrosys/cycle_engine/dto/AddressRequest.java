package com.itrosys.cycle_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

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
    private String addressType;
    private String deliveryInstructions;
    
    // Postal metadata
    private PostalMetadataRequest postalMetadata;

}
