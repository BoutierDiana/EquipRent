package com.equiprent.unit.domain.exception;

import com.equiprent.shared.domain.exception.ReglaNegocioException;
import com.equiprent.unit.domain.model.EstadoUnidad;

public class EstadoInicialInvalidoException extends ReglaNegocioException {

    public EstadoInicialInvalidoException(EstadoUnidad estado) {
        super("Una unidad nueva sólo puede registrarse como DISPONIBLE o MANTENIMIENTO, no como " + estado);
    }
}
