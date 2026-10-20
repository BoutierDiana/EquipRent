package com.equiprent.unidadequipo.domain.exception;

public class NumeroSerieDuplicadoException extends RuntimeException {
    public NumeroSerieDuplicadoException(String numeroSerie) {
        super("Ya existe una unidad con el número de serie: " + numeroSerie);
    }
}