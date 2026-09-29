package com.equiprent.equipment.application;

import com.equiprent.equipment.domain.Equipo;
import com.equiprent.equipment.domain.exception.CodigoEquipoDuplicadoException;
import com.equiprent.equipment.domain.exception.EquipoNoEncontradoException;
import com.equiprent.equipment.domain.port.EquipoRepository;

import java.util.List;

/** Servicio Java puro: depende de la INTERFAZ, nunca de la implementación en memoria. */
public class EquipoService {

    private final EquipoRepository repository;

    public EquipoService(EquipoRepository repository) {
        this.repository = repository;
    }

    public Equipo registrar(Equipo equipo) {
        if (repository.existePorCodigo(equipo.getCodigo())) {
            throw new CodigoEquipoDuplicadoException(equipo.getCodigo());
        }
        return repository.guardar(equipo);
    }

    public Equipo obtener(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new EquipoNoEncontradoException(id));
    }

    public List<Equipo> listar() {
        return repository.listarTodos();
    }
}
