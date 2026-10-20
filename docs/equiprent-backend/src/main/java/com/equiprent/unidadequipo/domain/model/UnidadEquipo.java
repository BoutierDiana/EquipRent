package com.equiprent.unidadequipo.domain.model;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public class UnidadEquipo {

    private final Long id;
    private final Long equipoId;
    private final String numeroSerie;
    private String estadoOperativo;
    private BigDecimal metricaUsoAcumulada;
    private String notasEstado;
    private Boolean activo;
    private final OffsetDateTime createdAt;

    public UnidadEquipo(Long id, Long equipoId, String numeroSerie,
                        String estadoOperativo, BigDecimal metricaUsoAcumulada,
                        String notasEstado, Boolean activo, OffsetDateTime createdAt) {
        this.id = id;
        this.equipoId = equipoId;
        this.numeroSerie = numeroSerie;
        this.estadoOperativo = estadoOperativo;
        this.metricaUsoAcumulada = metricaUsoAcumulada;
        this.notasEstado = notasEstado;
        this.activo = activo;
        this.createdAt = createdAt;
    }

    // Getters de negocio
    public Long getId() { return id; }
    public Long getEquipoId() { return equipoId; }
    public String getNumeroSerie() { return numeroSerie; }
    public String getEstadoOperativo() { return estadoOperativo; }
    public BigDecimal getMetricaUsoAcumulada() { return metricaUsoAcumulada; }
    public String getNotasEstado() { return notasEstado; }
    public Boolean getActivo() { return activo; }
    public OffsetDateTime getCreatedAt() { return createdAt; }

    // Métodos de negocio si cambian de estado
    public void cambiarEstado(String nuevoEstado, String notas) {
        this.estadoOperativo = nuevoEstado;
        this.notasEstado = notas;
    }
}