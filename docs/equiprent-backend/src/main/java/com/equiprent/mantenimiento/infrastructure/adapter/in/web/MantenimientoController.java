package com.equiprent.mantenimiento.infrastructure.adapter.in.web;

import com.equiprent.mantenimiento.domain.exception.MantenimientoNoEncontradoException;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.port.in.ActualizarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.EliminarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.RegistrarMantenimientoUseCase;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.ActualizarMantenimientoRequest;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.CrearMantenimientoRequest;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.MantenimientoResponse;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.mapper.MantenimientoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD REST de la entidad hija de la relación 1:N (UnidadEquipo 1:N Mantenimiento).
 * CORS se configura una sola vez en shared.config.CorsConfig.
 */
@RestController
@RequestMapping("/api/mantenimientos")
public class MantenimientoController {

    private final RegistrarMantenimientoUseCase registrarUseCase;
    private final ConsultarMantenimientoUseCase consultarUseCase;
    private final ActualizarMantenimientoUseCase actualizarUseCase;
    private final EliminarMantenimientoUseCase eliminarUseCase;

    public MantenimientoController(RegistrarMantenimientoUseCase registrarUseCase,
                                   ConsultarMantenimientoUseCase consultarUseCase,
                                   ActualizarMantenimientoUseCase actualizarUseCase,
                                   EliminarMantenimientoUseCase eliminarUseCase) {
        this.registrarUseCase = registrarUseCase;
        this.consultarUseCase = consultarUseCase;
        this.actualizarUseCase = actualizarUseCase;
        this.eliminarUseCase = eliminarUseCase;
    }

    // POST /api/mantenimientos -> 201 | 400 validación o fechas | 404 unidad inexistente
    @PostMapping
    public ResponseEntity<MantenimientoResponse> registrar(@Valid @RequestBody CrearMantenimientoRequest request) {
        Mantenimiento dominio = MantenimientoWebMapper.toDomain(request);
        Mantenimiento guardado = registrarUseCase.registrar(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(MantenimientoWebMapper.toResponse(guardado));
    }

    // GET /api/mantenimientos -> 200 (todas las órdenes, más recientes primero)
    @GetMapping
    public ResponseEntity<List<MantenimientoResponse>> listar() {
        List<MantenimientoResponse> lista = consultarUseCase.listarTodos().stream()
                .map(MantenimientoWebMapper::toResponse)
                .toList();
        return ResponseEntity.ok(lista);
    }

    // GET /api/mantenimientos/{id} -> 200 | 404 con cuerpo ApiError
    @GetMapping("/{id}")
    public ResponseEntity<MantenimientoResponse> buscarPorId(@PathVariable Long id) {
        Mantenimiento mantenimiento = consultarUseCase.buscarPorId(id)
                .orElseThrow(() -> new MantenimientoNoEncontradoException(id));
        return ResponseEntity.ok(MantenimientoWebMapper.toResponse(mantenimiento));
    }

    // GET /api/mantenimientos/unidad-equipo/{unidadEquipoId} -> 200 (órdenes de una unidad)
    @GetMapping("/unidad-equipo/{unidadEquipoId}")
    public ResponseEntity<List<MantenimientoResponse>> listarPorUnidadEquipoId(@PathVariable Long unidadEquipoId) {
        List<MantenimientoResponse> lista = consultarUseCase.listarPorUnidadEquipoId(unidadEquipoId).stream()
                .map(MantenimientoWebMapper::toResponse)
                .toList();
        return ResponseEntity.ok(lista);
    }

    // PUT /api/mantenimientos/{id} -> 200 | 400 | 404 orden o unidad inexistente
    @PutMapping("/{id}")
    public ResponseEntity<MantenimientoResponse> actualizar(@PathVariable Long id,
                                                            @Valid @RequestBody ActualizarMantenimientoRequest request) {
        Mantenimiento actualizado = actualizarUseCase.actualizar(id, MantenimientoWebMapper.toDomain(request));
        return ResponseEntity.ok(MantenimientoWebMapper.toResponse(actualizado));
    }

    // DELETE /api/mantenimientos/{id} -> 204 | 404
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eliminarUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
