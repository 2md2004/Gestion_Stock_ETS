package com.sn.namora.backend.exceptions;

public class CategorieNotFoundException extends RuntimeException {
    public CategorieNotFoundException(String message) {
        super(message);
    }
}
