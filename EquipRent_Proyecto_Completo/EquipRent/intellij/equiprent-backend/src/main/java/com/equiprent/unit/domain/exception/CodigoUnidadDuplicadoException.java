package com.equiprent.unit.domain.exception;

import com.equiprent.shared.domain.exception.ConflictoNegocioException;

public class CodigoUnidadDuplicadoException extends ConflictoNegocioException {

    public CodigoUnidadDuplicadoException(String codigoUnidad) {
        super("RN-01: ya existe una unidad con el código " + codigoUnidad);
    }
}
