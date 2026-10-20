package com.equiprent.mantenimiento.domain.port.in;

import com.equiprent.mantenimiento.domain.model.Mantenimiento;

public interface RegistrarMantenimientoUseCase {
    Mantenimiento registrar(Mantenimiento mantenimiento);
}