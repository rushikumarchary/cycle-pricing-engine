package com.itrosys.cycle_engine.exception;


import java.io.Serial;

public class BrandNotFound extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public BrandNotFound(String message) {
        super(message);
    }
}
