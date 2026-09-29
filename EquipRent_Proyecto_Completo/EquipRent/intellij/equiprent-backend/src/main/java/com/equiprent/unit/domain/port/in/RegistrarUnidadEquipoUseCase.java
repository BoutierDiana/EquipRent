package com.equiprent.unit.domain.port.in;

import com.equiprent.unit.domain.model.UnidadEquipo;

/** Port IN: registrar una unidad física (RF-02). */
public interface RegistrarUnidadEquipoUseCase {

    UnidadEquipo registrar(UnidadEquipo unidad);
}
