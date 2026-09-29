package com.equiprent.equipment.domain.port.in;

import com.equiprent.equipment.domain.model.Equipo;

import java.util.List;
import java.util.Optional;

/** Port IN: capacidades de consulta del catálogo. Lo usa también el módulo unit. */
public interface ConsultarEquipoUseCase {

    Optional<Equipo> buscarPorId(Long id);

    List<Equipo> listar(String nombre);
}
