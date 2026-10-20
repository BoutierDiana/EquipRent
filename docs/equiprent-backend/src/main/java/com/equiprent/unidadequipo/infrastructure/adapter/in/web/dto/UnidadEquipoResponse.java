package com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record UnidadEquipoResponse(
        Long id,
        Long equipoId,
        String numeroSerie,
        String estadoOperativo,
        BigDecimal metricaUsoAcumulada,
        String notasEstado,
        Boolean activo,
        OffsetDateTime createdAt
) {}