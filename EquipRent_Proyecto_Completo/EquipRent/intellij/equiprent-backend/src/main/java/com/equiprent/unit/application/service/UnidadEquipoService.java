package com.equiprent.unit.application.service;

import com.equiprent.equipment.domain.exception.EquipoInactivoException;
import com.equiprent.equipment.domain.exception.EquipoNoEncontradoException;
import com.equiprent.equipment.domain.port.in.ConsultarEquipoUseCase;
import com.equiprent.unit.domain.exception.CodigoUnidadDuplicadoException;
import com.equiprent.unit.domain.exception.EstadoInicialInvalidoException;
import com.equiprent.unit.domain.exception.NumeroSerieDuplicadoException;
import com.equiprent.unit.domain.model.UnidadEquipo;
import com.equiprent.unit.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unit.domain.port.in.RegistrarUnidadEquipoUseCase;
import com.equiprent.unit.domain.port.out.UnidadEquipoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Caso de uso del módulo dependiente.
 * Valida al padre mediante el Port IN del módulo equipment (NO con su JpaRepository).
 */
@Service
public class UnidadEquipoService implements RegistrarUnidadEquipoUseCase, ConsultarUnidadEquipoUseCase {

    private final UnidadEquipoRepositoryPort repositoryPort;
    private final ConsultarEquipoUseCase consultarEquipoUseCase;

    public UnidadEquipoService(UnidadEquipoRepositoryPort repositoryPort,
                               ConsultarEquipoUseCase consultarEquipoUseCase) {
        this.repositoryPort = repositoryPort;
        this.consultarEquipoUseCase = consultarEquipoUseCase;
    }

    @Override
    @Transactional
    public UnidadEquipo registrar(UnidadEquipo unidad) {
        var equipo = consultarEquipoUseCase.buscarPorId(unidad.getEquipoId())
                .orElseThrow(() -> new EquipoNoEncontradoException(unidad.getEquipoId()));
        if (!equipo.isActivo()) {
            throw new EquipoInactivoException(equipo.getId());
        }
        if (!unidad.getEstado().permitidoEnAlta()) {
            throw new EstadoInicialInvalidoException(unidad.getEstado());
        }
        if (repositoryPort.existePorCodigoUnidad(unidad.getCodigoUnidad())) {
            throw new CodigoUnidadDuplicadoException(unidad.getCodigoUnidad());
        }
        if (unidad.getNumeroSerie() != null && repositoryPort.existePorNumeroSerie(unidad.getNumeroSerie())) {
            throw new NumeroSerieDuplicadoException(unidad.getNumeroSerie());
        }
        return repositoryPort.guardar(unidad);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UnidadEquipo> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UnidadEquipo> listarPorEquipo(Long equipoId) {
        if (consultarEquipoUseCase.buscarPorId(equipoId).isEmpty()) {
            throw new EquipoNoEncontradoException(equipoId);
        }
        return repositoryPort.listarPorEquipoId(equipoId);
    }
}
