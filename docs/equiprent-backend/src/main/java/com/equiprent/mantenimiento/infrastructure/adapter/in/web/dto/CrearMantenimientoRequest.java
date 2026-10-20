package com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.OffsetDateTime;

public record CrearMantenimientoRequest(
        @NotNull(message = "El unidadEquipoId es obligatorio")
        Long unidadEquipoId,

        Long danoId,

        @NotBlank(message = "El tipo es obligatorio (PREVENTIVO o CORRECTIVO)")
        @Pattern(regexp = "(?i)PREVENTIVO|CORRECTIVO", message = "El tipo debe ser PREVENTIVO o CORRECTIVO")
        String tipo,

        @NotNull(message = "La fecha de ingreso es obligatoria")
        OffsetDateTime fechaIngreso,

        @NotNull(message = "La fecha de egreso estimada es obligatoria")
        OffsetDateTime fechaEgresoEstimada,

        OffsetDateTime fechaEgresoReal,

        @NotBlank(message = "El estado es obligatorio (EN_PROCESO, COMPLETADO o CANCELADO)")
        @Pattern(regexp = "(?i)EN_PROCESO|COMPLETADO|CANCELADO",
                message = "El estado debe ser EN_PROCESO, COMPLETADO o CANCELADO")
        String estado
) {}
