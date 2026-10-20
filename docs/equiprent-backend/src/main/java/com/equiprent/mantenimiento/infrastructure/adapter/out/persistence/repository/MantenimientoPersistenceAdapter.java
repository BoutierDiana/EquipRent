package com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.repository;

import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.port.out.MantenimientoRepositoryPort;
import com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.entity.MantenimientoJpaEntity;
import com.equiprent.mantenimiento.infrastructure.adapter.out.persistence.mapper.MantenimientoPersistenceMapper;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.entity.UnidadEquipoJpaEntity;
import com.equiprent.unidadequipo.infrastructure.adapter.out.persistence.repository.SpringDataUnidadEquipoRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class MantenimientoPersistenceAdapter implements MantenimientoRepositoryPort {

    private final SpringDataMantenimientoRepository repository;
    private final SpringDataUnidadEquipoRepository unidadEquipoRepository;

    public MantenimientoPersistenceAdapter(SpringDataMantenimientoRepository repository,
                                           SpringDataUnidadEquipoRepository unidadEquipoRepository) {
        this.repository = repository;
        this.unidadEquipoRepository = unidadEquipoRepository;
    }

    @Override
    public Mantenimiento guardar(Mantenimiento domain) {
        // Se obtiene una referencia diferida sin consultar la base completa (lazy reference)
        UnidadEquipoJpaEntity padreRef = unidadEquipoRepository.getReferenceById(domain.getUnidadEquipoId());
        MantenimientoJpaEntity jpaEntity = MantenimientoPersistenceMapper.toJpaEntity(domain, padreRef);
        MantenimientoJpaEntity saved = repository.save(jpaEntity);
        return MantenimientoPersistenceMapper.toDomain(saved);
    }

    @Override
    public Optional<Mantenimiento> buscarPorId(Long id) {
        return repository.findById(id).map(MantenimientoPersistenceMapper::toDomain);
    }

    @Override
    public List<Mantenimiento> listarPorUnidadEquipoId(Long unidadEquipoId) {
        return repository.findByUnidadEquipo_Id(unidadEquipoId).stream()
                .map(MantenimientoPersistenceMapper::toDomain)
                .toList();
    }
}