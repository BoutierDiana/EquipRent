package com.equiprent.equipment.domain;

/** Record: dato simple e inmutable para mostrar un resumen del equipo. */
public record EquipoResumen(
        Long id,
        String codigo,
        String nombre,
        int totalUnidades,
        long unidadesDisponibles
) {}
