package com.itrosys.cycle_engine.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BrandUpdateRequest {

    private int id ;
    private String newBrandName;

    
}
