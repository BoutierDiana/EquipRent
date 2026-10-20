package com.equiprent.mantenimiento.domain.port.in;

import com.equiprent.mantenimiento.domain.model.Mantenimiento;

public interface ActualizarMantenimientoUseCase {
    /**
     * Reemplaza los datos de la orden. Permite reasignarla a otra unidad
     * (cambio de la entidad padre en la relación 1:N).
     */
    Mantenimiento actualizar(Long id, Mantenimiento datos);
}
