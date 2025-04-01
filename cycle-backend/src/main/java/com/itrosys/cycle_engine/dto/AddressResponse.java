package com.itrosys.cycle_engine.dto;


import com.itrosys.cycle_engine.enums.AddressType;
import lombok.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
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
}