package com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto;

/**
 * Catálogo cerrado de unidad_equipo.estado_operativo (ADR-001).
 * Debe coincidir con el CHECK ck_unidad_equipo_estado_operativo de V3.
 */
final class EstadoOperativoValores {

    static final String REGEX = "DISPONIBLE|RESERVADA|EN_USO|EN_MANTENIMIENTO|DE_BAJA";
    static final String MENSAJE =
            "El estado operativo debe ser DISPONIBLE, RESERVADA, EN_USO, EN_MANTENIMIENTO o DE_BAJA";

    private EstadoOperativoValores() {}
}
