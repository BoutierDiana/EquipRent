package com.equiprent.unit.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Unidad física concreta de un equipo (RN-01).
 * Conserva equipoId en lugar de un objeto JPA: el dominio no conoce @ManyToOne.
 */
public class UnidadEquipo {

    private final Long id;
    private final Long equipoId;
    private final String codigoUnidad;
    private final String numeroSerie;
    private final EstadoUnidad estado;
    private final LocalDate fechaAdquisicion;
    private final BigDecimal valorReferencial;
    private final String observacion;

    public UnidadEquipo(Long id, Long equipoId, String codigoUnidad, String numeroSerie,
                        EstadoUnidad estado, LocalDate fechaAdquisicion,
                        BigDecimal valorReferencial, String observacion) {
        if (codigoUnidad == null || codigoUnidad.isBlank()) {
            throw new IllegalArgumentException("RN-01: el código de la unidad es obligatorio");
        }
        if (valorReferencial != null && valorReferencial.signum() < 0) {
            throw new IllegalArgumentException("El valor referencial no puede ser negativo");
        }
        this.id = id;
        this.equipoId = Objects.requireNonNull(equipoId, "El equipo es obligatorio");
        this.codigoUnidad = normalizar(codigoUnidad);
        this.numeroSerie = (numeroSerie == null || numeroSerie.isBlank()) ? null : normalizar(numeroSerie);
        this.estado = estado == null ? EstadoUnidad.DISPONIBLE : estado;
        this.fechaAdquisicion = fechaAdquisicion;
        this.valorReferencial = valorReferencial;
        this.observacion = (observacion == null || observacion.isBlank()) ? null : observacion.trim();
    }

    public static String normalizar(String valor) {
        return valor == null ? null : valor.trim().toUpperCase();
    }

    public boolean estaDisponible() {
        return estado == EstadoUnidad.DISPONIBLE;
    }

    public Long getId() { return id; }
    public Long getEquipoId() { return equipoId; }
    public String getCodigoUnidad() { return codigoUnidad; }
    public String getNumeroSerie() { return numeroSerie; }
    public EstadoUnidad getEstado() { return estado; }
    public LocalDate getFechaAdquisicion() { return fechaAdquisicion; }
    public BigDecimal getValorReferencial() { return valorReferencial; }
    public String getObservacion() { return observacion; }
}
