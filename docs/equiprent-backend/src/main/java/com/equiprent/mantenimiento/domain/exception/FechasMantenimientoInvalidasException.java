package com.equiprent.mantenimiento.domain.exception;

import com.equiprent.shared.domain.exception.ReglaNegocioException;

public class FechasMantenimientoInvalidasException extends ReglaNegocioException {
    public FechasMantenimientoInvalidasException() {
        super("La fecha de egreso (estimada o real) no puede ser anterior a la fecha de ingreso.");
    }
}
