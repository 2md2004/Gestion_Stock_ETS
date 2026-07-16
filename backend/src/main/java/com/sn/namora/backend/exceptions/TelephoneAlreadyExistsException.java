package com.sn.namora.backend.exceptions;

public class TelephoneAlreadyExistsException extends RuntimeException {
    public TelephoneAlreadyExistsException(String message) {
        super(message);
    }
}
