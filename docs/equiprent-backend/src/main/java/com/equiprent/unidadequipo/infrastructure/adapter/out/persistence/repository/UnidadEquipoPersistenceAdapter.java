package com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.repository;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.out.UnidadEquipoRepositoryPort;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.mapper.UnidadEquipoPersistenceMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class UnidadEquipoPersistenceAdapter implements UnidadEquipoRepositoryPort {

    private final SpringDataUnidadEquipoRepository repository;

    public UnidadEquipoPersistenceAdapter(SpringDataUnidadEquipoRepository repository) {
        this.repository = repository;
    }

    @Override
    public UnidadEquipo guardar(UnidadEquipo domain) {
        UnidadEquipoJpaEntity jpaEntity = UnidadEquipoPersistenceMapper.toJpaEntity(domain);
        UnidadEquipoJpaEntity saved = repository.save(jpaEntity);
        return UnidadEquipoPersistenceMapper.toDomain(saved);
    }

    @Override
    public Optional<UnidadEquipo> buscarPorId(Long id) {
        return repository.findById(id)
                .map(UnidadEquipoPersistenceMapper::toDomain);
    }

    @Override
    public List<UnidadEquipo> listarTodos() {
        return repository.findAll().stream()
                .map(UnidadEquipoPersistenceMapper::toDomain)
                .toList();
    }

    @Override
    public boolean existePorNumeroSerie(String numeroSerie) {
        return repository.existsByNumeroSerie(numeroSerie);
    }
}