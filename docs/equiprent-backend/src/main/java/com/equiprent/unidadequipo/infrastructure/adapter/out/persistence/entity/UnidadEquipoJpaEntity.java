package com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Table(name = "unidad_equipo", schema = "equiprent")
public class UnidadEquipoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "unidad_equipo_id")
    private Long id;

    @Column(name = "equipo_id", nullable = false)
    private Long equipoId;

    @Column(name = "numero_serie", nullable = false, unique = true, length = 50)
    private String numeroSerie;

    @Column(name = "estado_operativo", nullable = false, length = 30)
    private String estadoOperativo;

    @Column(name = "metrica_uso_acumulada", nullable = false)
    private BigDecimal metricaUsoAcumulada;

    @Column(name = "notas_estado", columnDefinition = "text")
    private String notasEstado;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected UnidadEquipoJpaEntity() {
    }

    public UnidadEquipoJpaEntity(Long id, Long equipoId, String numeroSerie,
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

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEquipoId() { return equipoId; }
    public void setEquipoId(Long equipoId) { this.equipoId = equipoId; }

    public String getNumeroSerie() { return numeroSerie; }
    public void setNumeroSerie(String numeroSerie) { this.numeroSerie = numeroSerie; }

    public String getEstadoOperativo() { return estadoOperativo; }
    public void setEstadoOperativo(String estadoOperativo) { this.estadoOperativo = estadoOperativo; }

    public BigDecimal getMetricaUsoAcumulada() { return metricaUsoAcumulada; }
    public void setMetricaUsoAcumulada(BigDecimal metricaUsoAcumulada) { this.metricaUsoAcumulada = metricaUsoAcumulada; }

    public String getNotasEstado() { return notasEstado; }
    public void setNotasEstado(String notasEstado) { this.notasEstado = notasEstado; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}