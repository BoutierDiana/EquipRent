package com.equiprent.equipment.domain.port;

import com.equiprent.equipment.domain.Equipo;

import java.util.List;
import java.util.Optional;

/**
 * Contrato del repositorio. NO sabe si los datos viven en memoria,
 * en PostgreSQL o en otro lugar: sólo declara QUÉ necesita la aplicación.
 */
public interface EquipoRepository {

    Equipo guardar(Equipo equipo);

    Optional<Equipo> buscarPorId(Long id);

    List<Equipo> listarTodos();

    boolean existePorCodigo(String codigo);
}
