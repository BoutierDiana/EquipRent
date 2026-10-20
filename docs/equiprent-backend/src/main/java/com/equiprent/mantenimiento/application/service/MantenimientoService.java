package com.equiprent.mantenimiento.application.service;

import com.equiprent.mantenimiento.domain.exception.UnidadEquipoNoEncontradaException;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.RegistrarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.out.MantenimientoRepositoryPort;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MantenimientoService implements RegistrarMantenimientoUseCase, ConsultarMantenimientoUseCase {

    private final MantenimientoRepositoryPort repositoryPort;
    private final ConsultarUnidadEquipoUseCase consultarUnidadEquipoUseCase;

    public MantenimientoService(MantenimientoRepositoryPort repositoryPort,
                                ConsultarUnidadEquipoUseCase consultarUnidadEquipoUseCase) {
        this.repositoryPort = repositoryPort;
        this.consultarUnidadEquipoUseCase = consultarUnidadEquipoUseCase;
    }

    @Override
    @Transactional
    public Mantenimiento registrar(Mantenimiento mantenimiento) {
        if (consultarUnidadEquipoUseCase.buscarPorId(mantenimiento.getUnidadEquipoId()).isEmpty()) {
            throw new UnidadEquipoNoEncontradaException(mantenimiento.getUnidadEquipoId());
        }

        return repositoryPort.guardar(mantenimiento);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Mantenimiento> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Mantenimiento> listarPorUnidadEquipoId(Long unidadEquipoId) {
        return repositoryPort.listarPorUnidadEquipoId(unidadEquipoId);
    }
}