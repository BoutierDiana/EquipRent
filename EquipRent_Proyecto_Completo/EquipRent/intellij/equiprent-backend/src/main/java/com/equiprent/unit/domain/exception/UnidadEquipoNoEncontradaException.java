package com.equiprent.unit.domain.exception;

import com.equiprent.shared.domain.exception.RecursoNoEncontradoException;

public class UnidadEquipoNoEncontradaException extends RecursoNoEncontradoException {

    public UnidadEquipoNoEncontradaException(Long id) {
        super("No existe la unidad de equipo con id: " + id);
    }
}
