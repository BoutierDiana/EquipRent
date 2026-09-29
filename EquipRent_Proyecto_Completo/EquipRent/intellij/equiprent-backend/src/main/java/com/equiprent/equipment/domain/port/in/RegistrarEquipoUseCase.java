package com.equiprent.equipment.domain.port.in;

import com.equiprent.equipment.domain.model.Equipo;

/** Port IN: capacidad "registrar un equipo en el catálogo" (RF-01). */
public interface RegistrarEquipoUseCase {

    Equipo registrar(Equipo equipo);
}
