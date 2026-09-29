package com.equiprent.equipment.infrastructure.adapter.in.web.dto;

/** Lo que la API expone. Incluye id y activo, que no se reciben al crear. */
public record EquipoResponse(
        Long id,
        Long categoriaId,
        String codigo,
        String nombre,
        String marca,
        String modelo,
        String descripcion,
        boolean activo
) {}
