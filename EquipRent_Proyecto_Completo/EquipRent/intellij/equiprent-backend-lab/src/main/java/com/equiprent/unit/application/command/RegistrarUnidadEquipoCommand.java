package com.equiprent.unit.application.command;

import java.math.BigDecimal;

/**
 * Datos que necesita la operación "registrar unidad física" (RF-02).
 * No incluye id (lo genera el sistema) ni estado (arranca DISPONIBLE).
 */
public record RegistrarUnidadEquipoCommand(
        Long equipoId,
        String codigoUnidad,
        String numeroSerie,
        BigDecimal valorReferencial
) {}
