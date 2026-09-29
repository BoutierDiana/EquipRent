package com.equiprent.unit.infrastructure.adapter.in.web.dto;

import com.equiprent.unit.domain.model.EstadoUnidad;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UnidadEquipoResponse(
        Long id,
        Long equipoId,
        String codigoUnidad,
        String numeroSerie,
        EstadoUnidad estado,
        LocalDate fechaAdquisicion,
        BigDecimal valorReferencial,
        String observacion
) {}
