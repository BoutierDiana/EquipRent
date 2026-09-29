package com.equiprent.unit.infrastructure.adapter.in.web.mapper;

import com.equiprent.unit.domain.model.UnidadEquipo;
import com.equiprent.unit.infrastructure.adapter.in.web.dto.CrearUnidadEquipoRequest;
import com.equiprent.unit.infrastructure.adapter.in.web.dto.UnidadEquipoResponse;

public final class UnidadEquipoWebMapper {

    private UnidadEquipoWebMapper() {
    }

    public static UnidadEquipo toDomain(CrearUnidadEquipoRequest request) {
        return new UnidadEquipo(
                null,
                request.equipoId(),
                request.codigoUnidad(),
                request.numeroSerie(),
                request.estado(),
                request.fechaAdquisicion(),
                request.valorReferencial(),
                request.observacion()
        );
    }

    public static UnidadEquipoResponse toResponse(UnidadEquipo unidad) {
        return new UnidadEquipoResponse(
                unidad.getId(),
                unidad.getEquipoId(),
                unidad.getCodigoUnidad(),
                unidad.getNumeroSerie(),
                unidad.getEstado(),
                unidad.getFechaAdquisicion(),
                unidad.getValorReferencial(),
                unidad.getObservacion()
        );
    }
}
