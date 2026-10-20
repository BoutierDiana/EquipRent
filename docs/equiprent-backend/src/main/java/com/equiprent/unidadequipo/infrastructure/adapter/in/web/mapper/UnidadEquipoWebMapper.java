package com.equiprent.unidadequipo.infrastructure.adapter.in.web.mapper;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.CrearUnidadEquipoRequest;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.UnidadEquipoResponse;

import java.time.OffsetDateTime;

public final class UnidadEquipoWebMapper {

    private UnidadEquipoWebMapper() {}

    public static UnidadEquipo toDomain(CrearUnidadEquipoRequest request) {
        if (request == null) {
            return null;
        }
        return new UnidadEquipo(
                null,
                request.equipoId(),
                request.numeroSerie(),
                request.estadoOperativo(),
                request.metricaUsoAcumulada(),
                request.notasEstado(),
                true,
                OffsetDateTime.now()
        );
    }

    public static UnidadEquipoResponse toResponse(UnidadEquipo domain) {
        if (domain == null) {
            return null;
        }
        return new UnidadEquipoResponse(
                domain.getId(),
                domain.getEquipoId(),
                domain.getNumeroSerie(),
                domain.getEstadoOperativo(),
                domain.getMetricaUsoAcumulada(),
                domain.getNotasEstado(),
                domain.getActivo(),
                domain.getCreatedAt()
        );
    }
}