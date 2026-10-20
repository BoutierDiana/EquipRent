package com.equiprent.unidadequipo.domain.exception;

import com.equiprent.shared.domain.exception.ConflictoNegocioException;

/**
 * La unidad tiene filas hijas (mantenimientos, daños o detalles de reserva)
 * y la FK ON DELETE RESTRICT impide eliminarla.
 */
public class UnidadEquipoConDependenciasException extends ConflictoNegocioException {
    public UnidadEquipoConDependenciasException(Long unidadEquipoId) {
        super("No se puede eliminar la unidad de equipo con ID " + unidadEquipoId
                + " porque tiene órdenes de mantenimiento u otros registros asociados.");
    }
}
