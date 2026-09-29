package com.equiprent.equipment.domain;

import com.equiprent.equipment.domain.exception.CodigoUnidadRepetidoEnEquipoException;
import com.equiprent.unit.domain.UnidadEquipo;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Entidad PADRE del par 1:N (tabla equipo).
 * Un Equipo es el TIPO/modelo del catálogo; las unidades físicas son UnidadEquipo.
 */
public class Equipo {

    private final Long id;
    private final Long categoriaId;
    private final String codigo;
    private final String nombre;
    private final String marca;
    private final String modelo;
    private boolean activo;

    // Relación 1:N expresada con una colección privada (Cap. 01, paso 6)
    private final List<UnidadEquipo> unidades = new ArrayList<>();

    public Equipo(Long id, Long categoriaId, String codigo, String nombre,
                  String marca, String modelo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código del equipo es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del equipo es obligatorio");
        }
        this.id = Objects.requireNonNull(id, "El id es obligatorio");
        this.categoriaId = Objects.requireNonNull(categoriaId, "La categoría es obligatoria");
        this.codigo = codigo.trim().toUpperCase();
        this.nombre = nombre.trim();
        this.marca = marca;
        this.modelo = modelo;
        this.activo = true;
    }

    /** Regla: la unidad debe pertenecer a este equipo y su código no puede repetirse. */
    public void agregarUnidad(UnidadEquipo unidad) {
        Objects.requireNonNull(unidad, "La unidad es obligatoria");
        if (!id.equals(unidad.getEquipoId())) {
            throw new IllegalArgumentException(
                    "La unidad " + unidad.getCodigoUnidad() + " no pertenece al equipo " + codigo);
        }
        boolean repetido = unidades.stream()
                .anyMatch(u -> u.getCodigoUnidad().equals(unidad.getCodigoUnidad()));
        if (repetido) {
            throw new CodigoUnidadRepetidoEnEquipoException(unidad.getCodigoUnidad());
        }
        unidades.add(unidad);
    }

    public long contarUnidadesDisponibles() {
        return unidades.stream().filter(UnidadEquipo::estaDisponible).count();
    }

    public void desactivar() {
        this.activo = false;
    }

    public List<UnidadEquipo> getUnidades() {
        return Collections.unmodifiableList(unidades);
    }

    public EquipoResumen toResumen() {
        return new EquipoResumen(id, codigo, nombre, unidades.size(), contarUnidadesDisponibles());
    }

    public Long getId() { return id; }
    public Long getCategoriaId() { return categoriaId; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public boolean isActivo() { return activo; }

    @Override
    public String toString() {
        return "Equipo{id=" + id + ", codigo='" + codigo + "', nombre='" + nombre
                + "', unidades=" + unidades.size() + ", activo=" + activo + "}";
    }
}
