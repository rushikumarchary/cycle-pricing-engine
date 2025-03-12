package com.example.cpe.exception;

public class DuplicateBrand extends RuntimeException {
    public DuplicateBrand(String message) {
        super(message);
    }
}