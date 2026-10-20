package com.equiprent.unidadequipo.application.service;

import com.equiprent.unidadequipo.domain.exception.NumeroSerieDuplicadoException;
import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.RegistrarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.out.UnidadEquipoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UnidadEquipoService implements RegistrarUnidadEquipoUseCase, ConsultarUnidadEquipoUseCase {

    private final UnidadEquipoRepositoryPort repositoryPort;

    public UnidadEquipoService(UnidadEquipoRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    @Transactional
    public UnidadEquipo registrar(UnidadEquipo entidad) {
        if (repositoryPort.existePorNumeroSerie(entidad.getNumeroSerie())) {
            throw new NumeroSerieDuplicadoException(entidad.getNumeroSerie());
        }
        return repositoryPort.guardar(entidad);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UnidadEquipo> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnidadEquipo> listar(String filtroEstado) {
        List<UnidadEquipo> todas = repositoryPort.listarTodos();

        if (filtroEstado == null || filtroEstado.isBlank()) {
            return todas;
        }

        return todas.stream()
                .filter(u -> u.getEstadoOperativo().equalsIgnoreCase(filtroEstado))
                .toList();
    }
}