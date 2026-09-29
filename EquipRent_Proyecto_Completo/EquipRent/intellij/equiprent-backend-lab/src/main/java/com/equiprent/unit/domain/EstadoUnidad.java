package com.equiprent.unit.domain;

/**
 * Estados reales de una unidad física (CHECK ck_unidad_equipo_estado).
 * No existe RESERVADA: la reserva se controla por rango de fechas (RN-03, RN-04).
 */
public enum EstadoUnidad {
    DISPONIBLE,
    ENTREGADA,
    EN_INSPECCION,
    MANTENIMIENTO,
    BLOQUEADA,
    BAJA
}
