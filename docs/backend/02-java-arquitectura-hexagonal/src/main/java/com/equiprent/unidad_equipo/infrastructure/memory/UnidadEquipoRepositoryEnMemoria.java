package com.equiprent.unidad_equipo.infrastructure.memory;

import com.equiprent.unidad_equipo.domain.UnidadEquipo;
import com.equiprent.unidad_equipo.domain.port.UnidadEquipoRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class UnidadEquipoRepositoryEnMemoria implements UnidadEquipoRepository {

    private final Map<Long, UnidadEquipo> baseDeDatos = new HashMap<>();
    private long generadorId = 1L;

    @Override
    public UnidadEquipo guardar(UnidadEquipo entidad) {
        if (entidad.getId() == null) {
            entidad.setId(generadorId++);
        }
        baseDeDatos.put(entidad.getId(), entidad);
        return entidad;
    }

    @Override
    public Optional<UnidadEquipo> buscarPorId(Long id) {
        return Optional.ofNullable(baseDeDatos.get(id));
    }

    @Override
    public List<UnidadEquipo> listarTodos() {
        return new ArrayList<>(baseDeDatos.values());
    }

    @Override
    public boolean existePorNumeroSerie(String numeroSerie) {
        return baseDeDatos.values().stream()
                .anyMatch(u -> u.getNumeroSerie() != null && u.getNumeroSerie().equalsIgnoreCase(numeroSerie));
    }
}