package com.equiprent.equipment.infrastructure.adapter.in.web.mapper;

import com.equiprent.equipment.domain.model.Equipo;
import com.equiprent.equipment.infrastructure.adapter.in.web.dto.CrearEquipoRequest;
import com.equiprent.equipment.infrastructure.adapter.in.web.dto.EquipoResponse;

public final class EquipoWebMapper {

    private EquipoWebMapper() {
    }

    public static Equipo toDomain(CrearEquipoRequest request) {
        return Equipo.nuevo(
                request.categoriaId(),
                request.codigo(),
                request.nombre(),
                request.marca(),
                request.modelo(),
                request.descripcion()
        );
    }

    public static EquipoResponse toResponse(Equipo equipo) {
        return new EquipoResponse(
                equipo.getId(),
                equipo.getCategoriaId(),
                equipo.getCodigo(),
                equipo.getNombre(),
                equipo.getMarca(),
                equipo.getModelo(),
                equipo.getDescripcion(),
                equipo.isActivo()
        );
    }
}
