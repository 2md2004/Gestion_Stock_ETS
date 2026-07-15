package com.sn.namora.backend.exceptions;

public class ResetTokenExpiredException extends RuntimeException {
    public ResetTokenExpiredException(String message) {
        super(message);
    }
}
