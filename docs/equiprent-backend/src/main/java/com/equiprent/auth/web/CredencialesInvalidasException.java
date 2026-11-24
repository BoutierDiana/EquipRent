package com.equiprent.auth.web;

/** Usuario o contraseña incorrectos: GlobalExceptionHandler la traduce a 401. */
public class CredencialesInvalidasException extends RuntimeException {
    public CredencialesInvalidasException() {
        super("Usuario o contraseña incorrectos");
    }
}
