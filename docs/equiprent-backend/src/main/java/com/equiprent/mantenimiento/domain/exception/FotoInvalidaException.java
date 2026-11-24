package com.equiprent.mantenimiento.domain.exception;

import com.equiprent.shared.domain.exception.ReglaNegocioException;

/** Archivo vacío, demasiado grande o que no es una imagen JPEG/PNG real -> 400. */
public class FotoInvalidaException extends ReglaNegocioException {
    public FotoInvalidaException(String message) {
        super(message);
    }
}
