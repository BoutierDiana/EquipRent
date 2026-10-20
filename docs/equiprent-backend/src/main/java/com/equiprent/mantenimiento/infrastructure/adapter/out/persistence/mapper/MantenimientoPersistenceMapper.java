package com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.mapper;

import com.equiprent.mantenimiento.domain.model.EstadoMantenimiento;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.model.TipoMantenimiento;
import com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.entity.MantenimientoJpaEntity;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;

public final class MantenimientoPersistenceMapper {

    private MantenimientoPersistenceMapper() {}

    public static Mantenimiento toDomain(MantenimientoJpaEntity entity) {
        if (entity == null) return null;
        return new Mantenimiento(
                entity.getId(),
                entity.getUnidadEquipo().getId(),
                entity.getDanoId(),
                TipoMantenimiento.valueOf(entity.getTipo()),
                entity.getFechaIngreso(),
                entity.getFechaEgresoEstimada(),
                entity.getFechaEgresoReal(),
                EstadoMantenimiento.valueOf(entity.getEstado()),
                entity.getCreatedAt()
        );
    }

    public static MantenimientoJpaEntity toJpaEntity(Mantenimiento domain, UnidadEquipoJpaEntity unidadEquipoRef) {
        if (domain == null) return null;
        return new MantenimientoJpaEntity(
                domain.getId(),
                unidadEquipoRef,
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