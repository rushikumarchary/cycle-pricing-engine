package com.itrosys.cycle_engine.dto;

import com.itrosys.cycle_engine.entity.Address;
import com.itrosys.cycle_engine.enums.AddressType;
import lombok.Data;

@Data
public class AddressDTO {
    private Long id;
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
    private PostalMetadataDTO postalMetadata;

    public static AddressDTO fromEntity(Address address) {
        if (address == null) {
            return null;
        }
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setFullName(address.getFullName());
        dto.setMobileNumber(address.getMobileNumber());
        dto.setPinCode(address.getPinCode());
        dto.setFlatHouseNo(address.getFlatHouseNo());
        dto.setApartment(address.getApartment());
        dto.setAreaStreet(address.getAreaStreet());
        dto.setLandmark(address.getLandmark());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setAddressType(address.getAddressType());
        dto.setDeliveryInstructions(address.getDeliveryInstructions());
        dto.setPostalMetadata(PostalMetadataDTO.fromEntity(address.getPostalMetadata()));
        return dto;
    }
} 