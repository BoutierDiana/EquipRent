package com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.repository;

import com.equiprent.unidadequipo.domain.exception.UnidadEquipoConDependenciasException;
import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.out.UnidadEquipoRepositoryPort;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.mapper.UnidadEquipoPersistenceMapper;
import org.springframework.dao.DataIntegrityViolationException;
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
        // saveAndFlush: si PostgreSQL rechaza el INSERT/UPDATE (FK, CHECK, UNIQUE),
        // el error aparece aquí y no recién al confirmar la transacción.
        UnidadEquipoJpaEntity saved = repository.saveAndFlush(jpaEntity);
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

    @Override
    public boolean existePorNumeroSerieEnOtraUnidad(String numeroSerie, Long idExcluido) {
        return repository.existsByNumeroSerieAndIdNot(numeroSerie, idExcluido);
    }

    @Override
    public boolean existePorId(Long id) {
        return repository.existsById(id);
    }

    @Override
    public void eliminarPorId(Long id) {
        try {
            repository.deleteById(id);
            // flush fuerza el DELETE ahora: si hay hijos, la FK ON DELETE RESTRICT falla aquí
            // y el adaptador traduce el error técnico a una excepción del dominio (409).
            repository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new UnidadEquipoConDependenciasException(id);
        }
    }
}
