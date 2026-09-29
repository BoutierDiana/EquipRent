package com.equiprent.equipment.domain.model;

import java.util.Objects;

/**
 * Modelo de dominio del EQUIPO (tipo de activo del catálogo).
 * Sin @Entity: no sabe nada de JPA ni de PostgreSQL.
 */
public class Equipo {

    private final Long id;
    private final Long categoriaId;
    private final String codigo;
    private final String nombre;
    private final String marca;
    private final String modelo;
    private final String descripcion;
    private final boolean activo;

    public Equipo(Long id, Long categoriaId, String codigo, String nombre,
                  String marca, String modelo, String descripcion, boolean activo) {
        if (codigo == null || codigo.isBlank()) {
            throw new IllegalArgumentException("El código del equipo es obligatorio");
        }
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("El nombre del equipo es obligatorio");
        }
        this.id = id;
        this.categoriaId = Objects.requireNonNull(categoriaId, "La categoría es obligatoria");
        this.codigo = normalizarCodigo(codigo);
        this.nombre = nombre.trim();
        this.marca = limpiar(marca);
        this.modelo = limpiar(modelo);
        this.descripcion = limpiar(descripcion);
        this.activo = activo;
    }

    /** Fábrica para un equipo nuevo: sin id (lo genera PostgreSQL) y activo. */
    public static Equipo nuevo(Long categoriaId, String codigo, String nombre,
                               String marca, String modelo, String descripcion) {
        return new Equipo(null, categoriaId, codigo, nombre, marca, modelo, descripcion, true);
    }

    public static String normalizarCodigo(String codigo) {
        return codigo == null ? null : codigo.trim().toUpperCase();
    }

    private static String limpiar(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }

    public Long getId() { return id; }
    public Long getCategoriaId() { return categoriaId; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getMarca() { return marca; }
    public String getModelo() { return modelo; }
    public String getDescripcion() { return descripcion; }
    public boolean isActivo() { return activo; }
}
