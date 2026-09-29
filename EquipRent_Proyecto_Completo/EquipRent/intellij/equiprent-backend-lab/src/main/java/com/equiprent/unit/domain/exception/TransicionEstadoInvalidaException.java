package com.equiprent.unit.domain.exception;

import com.equiprent.unit.domain.EstadoUnidad;

public class TransicionEstadoInvalidaException extends RuntimeException {

    public TransicionEstadoInvalidaException(EstadoUnidad actual, EstadoUnidad destino) {
        super("No se puede pasar una unidad de " + actual + " a " + destino);
    }
}
