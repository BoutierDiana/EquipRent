package com.equiprent.mantenimiento.domain.exception;

import com.equiprent.shared.domain.exception.RecursoNoEncontradoException;

public class MantenimientoNoEncontradoException extends RecursoNoEncontradoException {
    public MantenimientoNoEncontradoException(Long mantenimientoId) {
        super("No existe el mantenimiento con ID: " + mantenimientoId);
    }
}
