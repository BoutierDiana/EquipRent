package com.equiprent.mantenimiento.domain.exception;

public class UnidadEquipoNoEncontradaException extends RuntimeException {
    public UnidadEquipoNoEncontradaException(Long unidadEquipoId) {
        super("No existe la unidad de equipo con ID: " + unidadEquipoId);
    }
}