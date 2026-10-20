package com.equiprent.unidadequipo.domain.port.out;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;

import java.util.List;
import java.util.Optional;

public interface UnidadEquipoRepositoryPort {
    UnidadEquipo guardar(UnidadEquipo unidadEquipo);
    Optional<UnidadEquipo> buscarPorId(Long id);
    List<UnidadEquipo> listarTodos();
    boolean existePorNumeroSerie(String numeroSerie);
}