package com.itrosys.cycle_engine.exception;

public class BadCredentials extends RuntimeException{

    public BadCredentials(String massage){
        super(massage);
    }
}
