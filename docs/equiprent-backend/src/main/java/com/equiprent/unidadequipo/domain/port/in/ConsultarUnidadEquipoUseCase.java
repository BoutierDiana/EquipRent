package com.equiprent.unidadequipo.domain.port.in;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;

import java.util.List;
import java.util.Optional;

public interface ConsultarUnidadEquipoUseCase {
    Optional<UnidadEquipo> buscarPorId(Long id);
    List<UnidadEquipo> listar(String filtroEstado);
}