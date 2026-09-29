package com.equiprent.unit.domain.model;

/**
 * Coincide con CHECK ck_unidad_equipo_estado.
 * No existe RESERVADA: la reserva se controla por rango de fechas (RN-03, RN-04).
 */
public enum EstadoUnidad {
    DISPONIBLE,
    ENTREGADA,
    EN_INSPECCION,
    MANTENIMIENTO,
    BLOQUEADA,
    BAJA;

    /** Estados con los que una unidad puede darse de alta. */
    public boolean permitidoEnAlta() {
        return this == DISPONIBLE || this == MANTENIMIENTO;
    }
}
