package com.equiprent.unidad_equipo.application;

import com.equiprent.unidad_equipo.domain.UnidadEquipo;
import com.equiprent.unidad_equipo.domain.port.UnidadEquipoRepository;
import com.equiprent.unidad_equipo.exception.NumeroSerieDuplicadoException;
import com.equiprent.unidad_equipo.exception.UnidadNoEncontradaException;

import java.util.List;

public class UnidadEquipoService {

    // Dependencia hacia la interfaz (puerto), nunca hacia la implementación concreta
    private final UnidadEquipoRepository repository;

    // Inyección de dependencias por constructor
    public UnidadEquipoService(UnidadEquipoRepository repository) {
        this.repository = repository;
    }

    // Caso de uso: Registrar una nueva unidad validando que el número de serie sea único
    public UnidadEquipo registrar(UnidadEquipo unidad) {
        if (repository.existePorNumeroSerie(unidad.getNumeroSerie())) {
            throw new NumeroSerieDuplicadoException(
                    "Ya existe una unidad registrada con el número de serie: " + unidad.getNumeroSerie()
            );
        }
        return repository.guardar(unidad);
    }

    // Caso de uso: Obtener una unidad por su ID o lanzar excepción si no existe
    public UnidadEquipo obtenerPorId(Long id) {
        return repository.buscarPorId(id)
                .orElseThrow(() -> new UnidadNoEncontradaException(
                        "No se encontró la unidad de equipo con ID: " + id
                ));
    }

    // Caso de uso: Listar todas las unidades
    public List<UnidadEquipo> listarTodas() {
        return repository.listarTodos();
    }
}