package com.sn.namora.backend.exceptions;

public class ProduitNotFoundException extends RuntimeException {
    public ProduitNotFoundException(String message) {
        super(message);
    }
}
