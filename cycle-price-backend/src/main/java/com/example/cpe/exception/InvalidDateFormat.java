package com.example.cpe.exception;

public class InvalidDateFormat extends RuntimeException {
    public InvalidDateFormat(String s) {
        super(s);
    }
}