package com.equiprent.equipment.infrastructure.memory;

import com.equiprent.equipment.domain.Equipo;
import com.equiprent.equipment.domain.port.EquipoRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Implementación en memoria. Usa Map porque la operación más frecuente es
 * buscar por id (clave -> valor), igual que una PK. LinkedHashMap conserva
 * el orden de inserción para listar.
 */
public class EquipoRepositoryEnMemoria implements EquipoRepository {

    private final Map<Long, Equipo> datos = new LinkedHashMap<>();

    @Override
    public Equipo guardar(Equipo equipo) {
        datos.put(equipo.getId(), equipo);
        return equipo;
    }

    @Override
    public Optional<Equipo> buscarPorId(Long id) {
        return Optional.ofNullable(datos.get(id));
    }

    @Override
    public List<Equipo> listarTodos() {
        return new ArrayList<>(datos.values());
    }

    @Override
    public boolean existePorCodigo(String codigo) {
        return datos.values().stream()
                .anyMatch(e -> e.getCodigo().equalsIgnoreCase(codigo));
    }
}
