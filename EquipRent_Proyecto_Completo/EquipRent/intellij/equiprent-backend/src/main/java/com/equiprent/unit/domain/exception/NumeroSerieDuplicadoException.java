package com.equiprent.unit.domain.exception;

import com.equiprent.shared.domain.exception.ConflictoNegocioException;

public class NumeroSerieDuplicadoException extends ConflictoNegocioException {

    public NumeroSerieDuplicadoException(String numeroSerie) {
        super("Ya existe una unidad con el número de serie " + numeroSerie);
    }
}
