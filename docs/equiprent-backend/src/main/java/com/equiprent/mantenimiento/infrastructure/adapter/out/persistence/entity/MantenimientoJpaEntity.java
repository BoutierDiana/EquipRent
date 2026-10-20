package com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.entity;

import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "mantenimiento", schema = "equiprent")
public class MantenimientoJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mantenimiento_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "unidad_equipo_id", nullable = false)
    private UnidadEquipoJpaEntity unidadEquipo;

    @Column(name = "dano_id")
    private Long danoId;

    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    @Column(name = "fecha_ingreso", nullable = false)
    private OffsetDateTime fechaIngreso;

    @Column(name = "fecha_egreso_estimada", nullable = false)
    private OffsetDateTime fechaEgresoEstimada;

    @Column(name = "fecha_egreso_real")
    private OffsetDateTime fechaEgresoReal;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    protected MantenimientoJpaEntity() {}

    public MantenimientoJpaEntity(Long id, UnidadEquipoJpaEntity unidadEquipo, Long danoId,
                                  String tipo, OffsetDateTime fechaIngreso,
                                  OffsetDateTime fechaEgresoEstimada, OffsetDateTime fechaEgresoReal,
                                  String estado, OffsetDateTime createdAt) {
        this.id = id;
        this.unidadEquipo = unidadEquipo;
        this.danoId = danoId;
        this.tipo = tipo;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgresoEstimada = fechaEgresoEstimada;
        this.fechaEgresoReal = fechaEgresoReal;
        this.estado = estado;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public UnidadEquipoJpaEntity getUnidadEquipo() { return unidadEquipo; }
    public Long getDanoId() { return danoId; }
    public String getTipo() { return tipo; }
    public OffsetDateTime getFechaIngreso() { return fechaIngreso; }
    public OffsetDateTime getFechaEgresoEstimada() { return fechaEgresoEstimada; }
    public OffsetDateTime getFechaEgresoReal() { return fechaEgresoReal; }
    public String getEstado() { return estado; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}