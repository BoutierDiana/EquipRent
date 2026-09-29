package com.equiprent.unit.infrastructure.adapter.in.web.dto;

import com.equiprent.unit.domain.model.EstadoUnidad;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CrearUnidadEquipoRequest(

        @NotNull(message = "El equipo es obligatorio")
        @Positive(message = "El id del equipo debe ser positivo")
        Long equipoId,

        @NotBlank(message = "El código de unidad es obligatorio")
        @Size(max = 40, message = "El código de unidad admite máximo 40 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]+$",
                 message = "El código de unidad sólo admite letras, números y guiones")
        String codigoUnidad,

        @Size(max = 80, message = "El número de serie admite máximo 80 caracteres")
        String numeroSerie,

        // Opcional: si no llega se usa DISPONIBLE. Un valor fuera del enum produce 400.
        EstadoUnidad estado,

        @PastOrPresent(message = "La fecha de adquisición no puede ser futura")
        LocalDate fechaAdquisicion,

        @PositiveOrZero(message = "El valor referencial no puede ser negativo")
        @Digits(integer = 10, fraction = 2, message = "Formato NUMERIC(12,2): máx. 10 enteros y 2 decimales")
        BigDecimal valorReferencial,

        @Size(max = 1000, message = "La observación admite máximo 1000 caracteres")
        String observacion
) {}
