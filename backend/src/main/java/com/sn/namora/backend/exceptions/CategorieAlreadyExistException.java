package com.sn.namora.backend.exceptions;
public class CategorieAlreadyExistException extends RuntimeException {
    public CategorieAlreadyExistException(String message) {
        super(message);
    }
}
