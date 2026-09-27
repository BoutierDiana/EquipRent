package com.equiprent.unidad_equipo.domain;

import com.equiprent.mantenimiento.domain.Mantenimiento;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class UnidadEquipo {

    // 1. ATRIBUTOS (privados)
    private Long id;                        // unidad_equipo_id (PK)
    private String numeroSerie;             // Serie física única
    private String estadoOperativo;         // DISPONIBLE, EN_MANTENIMIENTO, etc.
    private Double metricaUsoAcumulada;     // Horómetro / kilometraje
    private String notasEstado;             // Observaciones previas

    // Relación 1:N -> Una unidad tiene un historial de mantenimientos
    private final List<Mantenimiento> mantenimientos = new ArrayList<>();

    // 2. CONSTRUCTOR (inicializa y protege datos)
    public UnidadEquipo(String numeroSerie, String estadoOperativo, Double metricaUsoAcumulada) {
        if (numeroSerie == null || numeroSerie.isBlank()) {
            throw new IllegalArgumentException("El número de serie es obligatorio.");
        }
        if (metricaUsoAcumulada != null && metricaUsoAcumulada < 0) {
            throw new IllegalArgumentException("La métrica de uso acumulada no puede ser negativa.");
        }

        this.numeroSerie = numeroSerie;
        this.estadoOperativo = (estadoOperativo != null) ? estadoOperativo : "DISPONIBLE";
        this.metricaUsoAcumulada = (metricaUsoAcumulada != null) ? metricaUsoAcumulada : 0.0;
    }

    // 3. MÉTODOS DE LECTURA (Getters)
    public Long getId() {
        return id;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public String getEstadoOperativo() {
        return estadoOperativo;
    }

    public Double getMetricaUsoAcumulada() {
        return metricaUsoAcumulada;
    }

    public String getNotasEstado() {
        return notasEstado;
    }

    // Getter protegido de la colección 1:N (Paso 6)
    public List<Mantenimiento> getMantenimientos() {
        return Collections.unmodifiableList(mantenimientos);
    }

    // 4. COMPORTAMIENTO PROPIO (Reglas del negocio EquipRent)

    // Método de relación 1:N con lenguaje de dominio (Paso 6)
    public void registrarMantenimiento(Mantenimiento mantenimiento) {
        if (mantenimiento == null) {
            throw new IllegalArgumentException("El mantenimiento a registrar no puede ser nulo.");
        }
        this.mantenimientos.add(mantenimiento);
        this.marcarEnMantenimiento(); // Cambia automáticamente el estado de la unidad
    }

    public void registrarUso(Double horasOkm) {
        if (horasOkm == null || horasOkm <= 0) {
            throw new IllegalArgumentException("El incremento de uso debe ser mayor a cero.");
        }
        this.metricaUsoAcumulada += horasOkm;
    }

    public void marcarEnMantenimiento() {
        this.estadoOperativo = "EN_MANTENIMIENTO";
    }

    public void darDeAlta() {
        this.estadoOperativo = "DISPONIBLE";
    }
}