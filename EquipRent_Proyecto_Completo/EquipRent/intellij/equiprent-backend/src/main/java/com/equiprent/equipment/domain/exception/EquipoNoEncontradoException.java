package com.equiprent.equipment.domain.exception;

import com.equiprent.shared.domain.exception.RecursoNoEncontradoException;

public class EquipoNoEncontradoException extends RecursoNoEncontradoException {

    public EquipoNoEncontradoException(Long id) {
        super("No existe el equipo con id: " + id);
    }
}
