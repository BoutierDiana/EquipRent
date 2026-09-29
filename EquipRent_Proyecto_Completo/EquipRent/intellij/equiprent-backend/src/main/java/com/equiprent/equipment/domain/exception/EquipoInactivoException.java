package com.equiprent.equipment.domain.exception;

import com.equiprent.shared.domain.exception.ReglaNegocioException;

public class EquipoInactivoException extends ReglaNegocioException {

    public EquipoInactivoException(Long id) {
        super("El equipo con id " + id + " está inactivo y no admite nuevas unidades");
    }
}
