package com.equiprent.mantenimiento.application.command;

import com.equiprent.mantenimiento.domain.TipoMantenimiento;
import java.time.LocalDate;

public record RegistrarMantenimientoCommand(
        Long unidadEquipoId,
        Long danoId,
        TipoMantenimiento tipo,
        LocalDate fechaIngreso,
        LocalDate fechaEgresoEstimada
) {
}