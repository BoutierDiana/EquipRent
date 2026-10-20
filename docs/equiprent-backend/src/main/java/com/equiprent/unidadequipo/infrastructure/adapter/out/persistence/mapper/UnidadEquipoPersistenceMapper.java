package com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.mapper;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;

public final class UnidadEquipoPersistenceMapper {

    private UnidadEquipoPersistenceMapper() {
        // Constructor privado para clase utilitaria estática
    }

    // De Entidad JPA (Base de Datos) a Modelo de Dominio
    public static UnidadEquipo toDomain(UnidadEquipoJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new UnidadEquipo(
                entity.getId(),
                entity.getEquipoId(),
                entity.getNumeroSerie(),
                entity.getEstadoOperativo(),
                entity.getMetricaUsoAcumulada(),
                entity.getNotasEstado(),
                entity.getActivo(),
                entity.getCreatedAt()
        );
    }

    // De Modelo de Dominio a Entidad JPA (para guardar en BD)
    public static UnidadEquipoJpaEntity toJpaEntity(UnidadEquipo domain) {
        if (domain == null) {
            return null;
        }
        return new UnidadEquipoJpaEntity(
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