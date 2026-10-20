package com.equiprent.shared.domain.exception;

/**
 * Base de los errores "el recurso solicitado no existe".
 * GlobalExceptionHandler la traduce a HTTP 404 Not Found.
 */
public abstract class RecursoNoEncontradoException extends RuntimeException {
    protected RecursoNoEncontradoException(String message) {
        super(message);
    }
}
