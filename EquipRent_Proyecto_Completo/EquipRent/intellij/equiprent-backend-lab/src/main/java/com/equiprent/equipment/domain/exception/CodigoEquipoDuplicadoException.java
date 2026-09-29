package com.equiprent.equipment.domain.exception;

public class CodigoEquipoDuplicadoException extends RuntimeException {

    public CodigoEquipoDuplicadoException(String codigo) {
        super("Ya existe un equipo con el código: " + codigo);
    }
}
