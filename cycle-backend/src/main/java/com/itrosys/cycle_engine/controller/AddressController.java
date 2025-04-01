package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.AddressResponse;
import com.itrosys.cycle_engine.entity.Address;
import com.itrosys.cycle_engine.service.AddressService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @PostMapping("/save")
    public AddressResponse saveAddress(@RequestBody Address address) {
        return addressService.saveAddress(address);
    }

    @GetMapping("/{userId}")
    public List<AddressResponse> getUserAddresses(@PathVariable Long userId) {
        return addressService.getUserAddresses(userId);
    }
}
