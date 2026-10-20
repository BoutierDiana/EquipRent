package com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto;

import java.time.OffsetDateTime;

public record MantenimientoResponse(
        Long id,
        Long unidadEquipoId,
        Long danoId,
        String tipo,
        OffsetDateTime fechaIngreso,
        OffsetDateTime fechaEgresoEstimada,
        OffsetDateTime fechaEgresoReal,
        String estado,
        OffsetDateTime createdAt
) {}