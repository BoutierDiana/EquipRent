package com.equiprent.mantenimiento.domain.exception;

public class MantenimientoNoEncontradoException extends RuntimeException {
    public MantenimientoNoEncontradoException(Long mantenimientoId) {
        super("No existe el mantenimiento con ID: " + mantenimientoId);
    }
}