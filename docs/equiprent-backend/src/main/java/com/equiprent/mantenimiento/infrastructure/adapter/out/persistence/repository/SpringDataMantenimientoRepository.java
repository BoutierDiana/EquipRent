package com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.repository;

import com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.entity.MantenimientoJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpringDataMantenimientoRepository extends JpaRepository<MantenimientoJpaEntity, Long> {
    List<MantenimientoJpaEntity> findByUnidadEquipo_Id(Long unidadEquipoId);
}