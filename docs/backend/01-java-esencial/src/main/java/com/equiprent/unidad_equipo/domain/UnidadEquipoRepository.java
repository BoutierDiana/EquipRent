package com.equiprent.unidad_equipo.domain;

import java.util.Optional;

public interface UnidadEquipoRepository {

    // Guarda una nueva unidad o actualiza una existente
    UnidadEquipo guardar(UnidadEquipo unidadEquipo);

    // Busca una unidad por su identificador primario (PK)
    Optional<UnidadEquipo> buscarPorId(Long id);

    // Busca una unidad por su número de serie físico (clave única de negocio)
    Optional<UnidadEquipo> buscarPorNumeroSerie(String numeroSerie);
}