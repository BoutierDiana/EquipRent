package com.equiprent.shared.domain.exception;

/**
 * Base de los datos sintácticamente válidos que violan una regla del dominio
 * (por ejemplo, una fecha de egreso anterior a la de ingreso).
 * GlobalExceptionHandler la traduce a HTTP 400 Bad Request.
 */
public abstract class ReglaNegocioException extends RuntimeException {
    protected ReglaNegocioException(String message) {
        super(message);
    }
}
