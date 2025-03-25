package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.AddressResponse;
import com.itrosys.cycle_engine.entity.Address;
import com.itrosys.cycle_engine.repository.AddressRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    public AddressResponse saveAddress(Address address) {
        Address savedAddress = addressRepository.save(address);
        return convertToAddressResponse(savedAddress);
    }

    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::convertToAddressResponse)
                .collect(Collectors.toList());
    }

    private AddressResponse convertToAddressResponse(Address address) {
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
                .build();
    }
}
