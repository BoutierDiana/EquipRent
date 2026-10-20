package com.equiprent.unidadequipo.domain.exception;

import com.equiprent.shared.domain.exception.RecursoNoEncontradoException;

public class UnidadEquipoNoEncontradaException extends RecursoNoEncontradoException {
    public UnidadEquipoNoEncontradaException(Long unidadEquipoId) {
        super("No existe la unidad de equipo con ID: " + unidadEquipoId);
    }
}
