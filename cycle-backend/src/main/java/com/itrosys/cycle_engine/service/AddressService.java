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
        Address save = addressRepository.save(address);

        return AddressResponse.builder()
                .addressId(save.getId())
                .userId(save.getUser().getId())
                .fullName(save.getFullName())
                .mobileNumber(save.getMobileNumber())
                .pinCode(save.getPinCode())
                .flatHouseNo(save.getFlatHouseNo())
                .apartment(save.getApartment())
                .areaStreet(save.getAreaStreet())
                .landmark(save.getLandmark())
                .city(save.getCity())
                .state(save.getState())
                .addressType(save.getAddressType())
                .deliveryInstructions(save.getDeliveryInstructions())
                .build();
    }


    public List<AddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserId(userId)
                .stream()
                .map(address -> AddressResponse.builder()
                        .addressId(address.getId())
                        .userId(address.getUser().getId())  // Only returning userId
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
                        .build()
                ).collect(Collectors.toList());
    }
}
