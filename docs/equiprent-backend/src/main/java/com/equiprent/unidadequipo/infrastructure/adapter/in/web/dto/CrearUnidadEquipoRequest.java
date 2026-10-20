package com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CrearUnidadEquipoRequest(
        @NotNull(message = "El equipoId es obligatorio")
        Long equipoId,

        @NotBlank(message = "El número de serie es obligatorio")
        @Size(min = 5, max = 50, message = "El número de serie debe tener entre 5 y 50 caracteres")
        String numeroSerie,

        @NotBlank(message = "El estado operativo es obligatorio")
        String estadoOperativo,

        @NotNull(message = "La métrica de uso acumulada es obligatoria")
        @DecimalMin(value = "0.0", inclusive = true, message = "La métrica no puede ser negativa")
        BigDecimal metricaUsoAcumulada,

        String notasEstado
) {}