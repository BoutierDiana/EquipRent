package com.equiprent.unit.domain;

import com.equiprent.unit.domain.exception.TransicionEstadoInvalidaException;

import java.math.BigDecimal;
import java.util.Objects;

/**
 * Entidad DEPENDIENTE del par 1:N (tabla unidad_equipo).
 * Conserva equipoId: así se materializa la FK en el dominio.
 */
public class UnidadEquipo {

    private final Long id;
    private final Long equipoId;
    private final String codigoUnidad;
    private final String numeroSerie;
    private EstadoUnidad estado;
    private final BigDecimal valorReferencial;

    public UnidadEquipo(Long id, Long equipoId, String codigoUnidad,
                        String numeroSerie, EstadoUnidad estado, BigDecimal valorReferencial) {
        if (codigoUnidad == null || codigoUnidad.isBlank()) {
            throw new IllegalArgumentException("RN-01: la unidad necesita un código único");
        }
        if (valorReferencial != null && valorReferencial.signum() < 0) {
            throw new IllegalArgumentException("El valor referencial no puede ser negativo");
        }
        this.id = Objects.requireNonNull(id, "El id es obligatorio");
        this.equipoId = Objects.requireNonNull(equipoId, "El equipo es obligatorio");
        this.codigoUnidad = codigoUnidad.trim().toUpperCase();
        this.numeroSerie = numeroSerie;
        this.estado = estado == null ? EstadoUnidad.DISPONIBLE : estado;
        this.valorReferencial = valorReferencial;
    }

    public boolean estaDisponible() {
        return estado == EstadoUnidad.DISPONIBLE;
    }

    /** RN-07: un daño puede bloquear la unidad. Una unidad dada de baja no cambia más. */
    public void bloquear() {
        if (estado == EstadoUnidad.BAJA) {
            throw new TransicionEstadoInvalidaException(estado, EstadoUnidad.BLOQUEADA);
        }
        this.estado = EstadoUnidad.BLOQUEADA;
    }

    public void enviarAMantenimiento() {
        if (estado == EstadoUnidad.BAJA || estado == EstadoUnidad.ENTREGADA) {
            throw new TransicionEstadoInvalidaException(estado, EstadoUnidad.MANTENIMIENTO);
        }
        this.estado = EstadoUnidad.MANTENIMIENTO;
    }

    public Long getId() { return id; }
    public Long getEquipoId() { return equipoId; }
    public String getCodigoUnidad() { return codigoUnidad; }
    public String getNumeroSerie() { return numeroSerie; }
    public EstadoUnidad getEstado() { return estado; }
    public BigDecimal getValorReferencial() { return valorReferencial; }

    @Override
    public String toString() {
        return "UnidadEquipo{id=" + id + ", equipoId=" + equipoId + ", codigo='" + codigoUnidad
                + "', estado=" + estado + "}";
    }
}
