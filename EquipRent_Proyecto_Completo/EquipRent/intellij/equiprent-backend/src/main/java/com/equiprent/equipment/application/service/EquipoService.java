package com.equiprent.equipment.application.service;

import com.equiprent.equipment.domain.exception.CategoriaNoEncontradaException;
import com.equiprent.equipment.domain.exception.EquipoDuplicadoException;
import com.equiprent.equipment.domain.model.Equipo;
import com.equiprent.equipment.domain.port.in.ConsultarEquipoUseCase;
import com.equiprent.equipment.domain.port.in.RegistrarEquipoUseCase;
import com.equiprent.equipment.domain.port.out.EquipoRepositoryPort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EquipoService implements RegistrarEquipoUseCase, ConsultarEquipoUseCase {

    private final EquipoRepositoryPort repositoryPort;

    public EquipoService(EquipoRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    @Transactional
    public Equipo registrar(Equipo equipo) {
        if (!repositoryPort.existeCategoriaActiva(equipo.getCategoriaId())) {
            throw new CategoriaNoEncontradaException(equipo.getCategoriaId());
        }
        // Respeta uq_equipo_codigo antes de llegar a la base
        if (repositoryPort.existePorCodigo(equipo.getCodigo())) {
            throw new EquipoDuplicadoException(equipo.getCodigo());
        }
        return repositoryPort.guardar(equipo);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Equipo> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Equipo> listar(String nombre) {
        return repositoryPort.listar(nombre);
    }
}
