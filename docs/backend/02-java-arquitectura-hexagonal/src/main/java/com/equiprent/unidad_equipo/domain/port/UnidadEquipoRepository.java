package com.equiprent.unidad_equipo.domain.port;

import com.equiprent.unidad_equipo.domain.UnidadEquipo;
import java.util.List;
import java.util.Optional;

public interface UnidadEquipoRepository {
    UnidadEquipo guardar(UnidadEquipo entidad);
    Optional<UnidadEquipo> buscarPorId(Long id);
    List<UnidadEquipo> listarTodos();
    boolean existePorNumeroSerie(String numeroSerie);
}