package com.equiprent.shared.domain.exception;

/**
 * Base de los conflictos con el estado actual de los datos
 * (duplicados, registros dependientes que impiden borrar).
 * GlobalExceptionHandler la traduce a HTTP 409 Conflict.
 */
public abstract class ConflictoNegocioException extends RuntimeException {
    protected ConflictoNegocioException(String message) {
        super(message);
    }
}
