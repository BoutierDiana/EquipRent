package com.equiprent.equipment.infrastructure.adapter.in.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/** Lo que el cliente HTTP envía para crear un equipo. No lleva id ni activo. */
public record CrearEquipoRequest(

        @NotNull(message = "La categoría es obligatoria")
        @Positive(message = "La categoría debe ser un id positivo")
        Long categoriaId,

        @NotBlank(message = "El código es obligatorio")
        @Size(max = 30, message = "El código admite máximo 30 caracteres")
        @Pattern(regexp = "^[A-Za-z0-9-]+$",
                 message = "El código sólo admite letras, números y guiones")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 120, message = "El nombre admite máximo 120 caracteres")
        String nombre,

        @Size(max = 60, message = "La marca admite máximo 60 caracteres")
        String marca,

        @Size(max = 60, message = "El modelo admite máximo 60 caracteres")
        String modelo,

        @Size(max = 1000, message = "La descripción admite máximo 1000 caracteres")
        String descripcion
) {}
