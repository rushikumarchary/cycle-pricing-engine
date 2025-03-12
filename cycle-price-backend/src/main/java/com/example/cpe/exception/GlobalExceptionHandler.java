package com.example.cpe.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BrandNotFound.class)
	public ResponseEntity<String> handleBrandNotFoundException(BrandNotFound ex) {
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	}

	@ExceptionHandler(ItemNotFound.class)
	public ResponseEntity<String> handleItemNotFoundException(ItemNotFound ex){
		return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(DuplicateBrand.class)
	public ResponseEntity<String> handleDuplicateBrandException(DuplicateBrand ex){
		return new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_ACCEPTABLE);

	}
	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex){
		return  new ResponseEntity<>(ex.getMessage(),HttpStatus.NOT_ACCEPTABLE);
	}
}