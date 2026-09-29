package com.equiprent.equipment.domain.exception;

import com.equiprent.shared.domain.exception.ConflictoNegocioException;

public class EquipoDuplicadoException extends ConflictoNegocioException {

    public EquipoDuplicadoException(String codigo) {
        super("Ya existe un equipo con el código: " + codigo);
    }
}
