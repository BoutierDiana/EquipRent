package com.equiprent.mantenimiento.application.service;

import com.equiprent.mantenimiento.domain.exception.FechasMantenimientoInvalidasException;
import com.equiprent.mantenimiento.domain.exception.MantenimientoNoEncontradoException;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.port.in.ActualizarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.EliminarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.RegistrarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.out.MantenimientoRepositoryPort;
import com.equiprent.unidadequipo.domain.exception.UnidadEquipoNoEncontradaException;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MantenimientoService implements RegistrarMantenimientoUseCase, ConsultarMantenimientoUseCase,
        ActualizarMantenimientoUseCase, EliminarMantenimientoUseCase {

    private final MantenimientoRepositoryPort repositoryPort;
    private final ConsultarUnidadEquipoUseCase consultarUnidadEquipoUseCase;

    public MantenimientoService(MantenimientoRepositoryPort repositoryPort,
                                ConsultarUnidadEquipoUseCase consultarUnidadEquipoUseCase) {
        this.repositoryPort = repositoryPort;
        this.consultarUnidadEquipoUseCase = consultarUnidadEquipoUseCase;
    }

    @Override
    @Transactional
    public Mantenimiento registrar(Mantenimiento mantenimiento) {
        validarUnidadExiste(mantenimiento.getUnidadEquipoId());
        validarFechas(mantenimiento);
        return repositoryPort.guardar(mantenimiento);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Mantenimiento> buscarPorId(Long id) {
        return repositoryPort.buscarPorId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Mantenimiento> listarPorUnidadEquipoId(Long unidadEquipoId) {
        return repositoryPort.listarPorUnidadEquipoId(unidadEquipoId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Mantenimiento> listarTodos() {
        return repositoryPort.listarTodos();
    }

    @Override
    @Transactional
    public Mantenimiento actualizar(Long id, Mantenimiento datos) {
        Mantenimiento actual = repositoryPort.buscarPorId(id)
                .orElseThrow(() -> new MantenimientoNoEncontradoException(id));

        // La nueva unidad (puede ser otra: reasignación del padre) debe existir.
        validarUnidadExiste(datos.getUnidadEquipoId());
        validarFechas(datos);

        Mantenimiento actualizado = new Mantenimiento(
                actual.getId(),
                datos.getUnidadEquipoId(),
                datos.getDanoId(),
                datos.getTipo(),
                datos.getFechaIngreso(),
                datos.getFechaEgresoEstimada(),
                datos.getFechaEgresoReal(),
                datos.getEstado(),
                actual.getCreatedAt()
        );
        return repositoryPort.guardar(actualizado);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!repositoryPort.existePorId(id)) {
            throw new MantenimientoNoEncontradoException(id);
        }
        repositoryPort.eliminarPorId(id);
    }

    private void validarUnidadExiste(Long unidadEquipoId) {
        if (consultarUnidadEquipoUseCase.buscarPorId(unidadEquipoId).isEmpty()) {
            throw new UnidadEquipoNoEncontradaException(unidadEquipoId);
        }
    }

    private void validarFechas(Mantenimiento mantenimiento) {
        if (!mantenimiento.tieneFechasCoherentes()) {
            throw new FechasMantenimientoInvalidasException();
        }
    }
}
