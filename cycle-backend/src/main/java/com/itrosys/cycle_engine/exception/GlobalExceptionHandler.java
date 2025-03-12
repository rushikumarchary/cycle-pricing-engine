package com.itrosys.cycle_engine.exception;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<String> handleExpireToken(ExpiredJwtException ex){
        return new ResponseEntity<>("Token Expire Login Again", HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<String> handleUserNotFound(UsernameNotFoundException ex){
        return new ResponseEntity<>("You not register please Register first..",HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(BadCredentials.class)
    public ResponseEntity<String> handleBadCredential(BadCredentials ex){
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(UsernameAlreadyExists.class)
    public ResponseEntity<String> handleUsernameAlreadyExists(UsernameAlreadyExists ex){
        return  new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(EmailAlreadyExists.class)
    public ResponseEntity<String> handleEmailAlreadyExists(EmailAlreadyExists ex){
        return  new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(UsernameAndEmailAlreadyExists.class)
    public ResponseEntity<String> handleUsernameAlreadyExists(UsernameAndEmailAlreadyExists ex){
        return  new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_ACCEPTABLE);
    }
    @ExceptionHandler(BrandNotFound.class)
    public ResponseEntity<String> handleBrandNotFoundException(BrandNotFound ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ItemNotFound.class)
    public ResponseEntity<String> handleItemNotFoundException(ItemNotFound ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(DuplicateBrand.class)
    public ResponseEntity<String> handleDuplicateBrandException(DuplicateBrand ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);

    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_ACCEPTABLE);
    }


    @ExceptionHandler(InvalidDateFormat.class)
    public ResponseEntity<String> handleInvalidDateFormatException(InvalidDateFormat ex){
        return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(DuplicateItem.class)
    public  ResponseEntity<String> handleDuplicateItemException( DuplicateItem ex){
        return new ResponseEntity <>(ex.getMessage(),HttpStatus.BAD_REQUEST);

    }

}
