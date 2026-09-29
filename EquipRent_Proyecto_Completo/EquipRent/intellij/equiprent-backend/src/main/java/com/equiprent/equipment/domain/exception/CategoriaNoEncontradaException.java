package com.equiprent.equipment.domain.exception;

import com.equiprent.shared.domain.exception.ReglaNegocioException;

public class CategoriaNoEncontradaException extends ReglaNegocioException {

    public CategoriaNoEncontradaException(Long categoriaId) {
        super("No existe una categoría activa con id: " + categoriaId);
    }
}
