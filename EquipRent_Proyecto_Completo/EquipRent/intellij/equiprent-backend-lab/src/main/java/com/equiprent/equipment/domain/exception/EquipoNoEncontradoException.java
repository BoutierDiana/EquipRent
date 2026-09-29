package com.equiprent.equipment.domain.exception;

public class EquipoNoEncontradoException extends RuntimeException {

    public EquipoNoEncontradoException(Long id) {
        super("No existe el equipo con id: " + id);
    }
}
