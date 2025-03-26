package com.itrosys.cycle_engine.exception;

public class DuplicateItem extends RuntimeException{

    public DuplicateItem (String massage){
        super(massage);
    }
}
