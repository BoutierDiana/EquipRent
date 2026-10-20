package com.equiprent.mantenimiento.domain.port.in;

import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import java.util.List;
import java.util.Optional;

public interface ConsultarMantenimientoUseCase {
    Optional<Mantenimiento> buscarPorId(Long id);
    List<Mantenimiento> listarPorUnidadEquipoId(Long unidadEquipoId);
}