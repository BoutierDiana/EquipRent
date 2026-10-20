package com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.repository;

import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpringDataUnidadEquipoRepository extends JpaRepository<UnidadEquipoJpaEntity, Long> {

    // Método derivado para validar o buscar por número de serie único
    Optional<UnidadEquipoJpaEntity> findByNumeroSerie(String numeroSerie);

    boolean existsByNumeroSerie(String numeroSerie);

    // Para editar: ¿otra unidad (id distinto) ya usa este número de serie?
    boolean existsByNumeroSerieAndIdNot(String numeroSerie, Long id);
}
