package com.equiprent.unidadequipo.domain.port.in;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;

public interface ActualizarUnidadEquipoUseCase {
    /**
     * Reemplaza los datos editables de la unidad identificada por id.
     * Conserva el id y la fecha de creación originales.
     */
    UnidadEquipo actualizar(Long id, UnidadEquipo datos);
}
