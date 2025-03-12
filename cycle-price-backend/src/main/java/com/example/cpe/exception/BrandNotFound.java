package com.example.cpe.exception;

public class BrandNotFound extends RuntimeException {
   

	
	private static final long serialVersionUID = 1L;

	public BrandNotFound(String message) {
        super(message);
    }
}
