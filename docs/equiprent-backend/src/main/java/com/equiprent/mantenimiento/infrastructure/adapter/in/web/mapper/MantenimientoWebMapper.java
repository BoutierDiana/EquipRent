package com.equiprent.mantenimiento.infrastructure.adapter.in.web.mapper;

import com.equiprent.mantenimiento.domain.model.EstadoMantenimiento;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.model.TipoMantenimiento;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.ActualizarMantenimientoRequest;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.CrearMantenimientoRequest;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.MantenimientoResponse;

import java.time.OffsetDateTime;

public final class MantenimientoWebMapper {

    private MantenimientoWebMapper() {}

    public static Mantenimiento toDomain(CrearMantenimientoRequest request) {
        if (request == null) return null;
        return new Mantenimiento(
                null,
                request.unidadEquipoId(),
                request.danoId(),
                TipoMantenimiento.valueOf(request.tipo().toUpperCase()),
                request.fechaIngreso(),
                request.fechaEgresoEstimada(),
                request.fechaEgresoReal(),
                EstadoMantenimiento.valueOf(request.estado().toUpperCase()),
                OffsetDateTime.now()
        );
    }

    /** Datos de un PUT: id y createdAt los aporta el servicio desde el registro existente. */
    public static Mantenimiento toDomain(ActualizarMantenimientoRequest request) {
        if (request == null) return null;
        return new Mantenimiento(
                null,
                request.unidadEquipoId(),
                request.danoId(),
                TipoMantenimiento.valueOf(request.tipo().toUpperCase()),
                request.fechaIngreso(),
                request.fechaEgresoEstimada(),
                request.fechaEgresoReal(),
                EstadoMantenimiento.valueOf(request.estado().toUpperCase()),
                null
        );
    }

    public static MantenimientoResponse toResponse(Mantenimiento domain) {
        if (domain == null) return null;
        return new MantenimientoResponse(
                domain.getId(),
                domain.getUnidadEquipoId(),
                domain.getDanoId(),
                domain.getTipo().name(),
                domain.getFechaIngreso(),
                domain.getFechaEgresoEstimada(),
                domain.getFechaEgresoReal(),
                domain.getEstado().name(),
                domain.getCreatedAt()
        );
    }
}
