package com.equiprent.unidadequipo.domain.port.out;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;

import java.util.List;
import java.util.Optional;

public interface UnidadEquipoRepositoryPort {
    UnidadEquipo guardar(UnidadEquipo unidadEquipo);
    Optional<UnidadEquipo> buscarPorId(Long id);
    List<UnidadEquipo> listarTodos();
    boolean existePorNumeroSerie(String numeroSerie);
    boolean existePorNumeroSerieEnOtraUnidad(String numeroSerie, Long idExcluido);
    boolean existePorId(Long id);

    /**
     * Elimina la unidad. Si la base de datos lo impide por registros dependientes
     * (FK ON DELETE RESTRICT), lanza UnidadEquipoConDependenciasException.
     */
    void eliminarPorId(Long id);
}
