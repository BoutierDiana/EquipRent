package com.equiprent.mantenimiento.domain.port.out;

import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import java.util.List;
import java.util.Optional;

public interface MantenimientoRepositoryPort {
    Mantenimiento guardar(Mantenimiento mantenimiento);
    Optional<Mantenimiento> buscarPorId(Long id);
    List<Mantenimiento> listarPorUnidadEquipoId(Long unidadEquipoId);
}