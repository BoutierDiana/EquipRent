package com.equiprent.equipment.domain.exception;

public class CodigoUnidadRepetidoEnEquipoException extends RuntimeException {

    public CodigoUnidadRepetidoEnEquipoException(String codigoUnidad) {
        super("El equipo ya tiene una unidad con el código: " + codigoUnidad);
    }
}
