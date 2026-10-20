package com.equiprent.mantenimiento.domain.model;

import java.time.OffsetDateTime;

public class Mantenimiento {
    private final Long id;
    private final Long unidadEquipoId;
    private final Long danoId;
    private final TipoMantenimiento tipo;
    private final OffsetDateTime fechaIngreso;
    private final OffsetDateTime fechaEgresoEstimada;
    private final OffsetDateTime fechaEgresoReal;
    private final EstadoMantenimiento estado;
    private final OffsetDateTime createdAt;

    public Mantenimiento(Long id, Long unidadEquipoId, Long danoId,
                         TipoMantenimiento tipo, OffsetDateTime fechaIngreso,
                         OffsetDateTime fechaEgresoEstimada, OffsetDateTime fechaEgresoReal,
                         EstadoMantenimiento estado, OffsetDateTime createdAt) {
        this.id = id;
        this.unidadEquipoId = unidadEquipoId;
        this.danoId = danoId;
        this.tipo = tipo;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgresoEstimada = fechaEgresoEstimada;
        this.fechaEgresoReal = fechaEgresoReal;
        this.estado = estado;
        this.createdAt = createdAt;
    }

    /**
     * Regla de dominio (diccionario de datos + CHECK ck_mantenimiento_fechas):
     * ni el egreso estimado ni el real pueden ser anteriores al ingreso.
     */
    public boolean tieneFechasCoherentes() {
        if (fechaIngreso == null || fechaEgresoEstimada == null) {
            return false;
        }
        boolean estimadaValida = !fechaEgresoEstimada.isBefore(fechaIngreso);
        boolean realValida = fechaEgresoReal == null || !fechaEgresoReal.isBefore(fechaIngreso);
        return estimadaValida && realValida;
    }

    public Long getId() { return id; }
    public Long getUnidadEquipoId() { return unidadEquipoId; }
    public Long getDanoId() { return danoId; }
    public TipoMantenimiento getTipo() { return tipo; }
    public OffsetDateTime getFechaIngreso() { return fechaIngreso; }
    public OffsetDateTime getFechaEgresoEstimada() { return fechaEgresoEstimada; }
    public OffsetDateTime getFechaEgresoReal() { return fechaEgresoReal; }
    public EstadoMantenimiento getEstado() { return estado; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
