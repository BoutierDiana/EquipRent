package com.equiprent.unit.domain.port.in;

import com.equiprent.unit.domain.model.UnidadEquipo;

import java.util.List;
import java.util.Optional;

public interface ConsultarUnidadEquipoUseCase {

    Optional<UnidadEquipo> buscarPorId(Long id);

    List<UnidadEquipo> listarPorEquipo(Long equipoId);
}
