package com.equiprent.unidadequipo.infrastructure.adapter.in.web;

import com.equiprent.unidadequipo.domain.exception.UnidadEquipoNoEncontradaException;
import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.in.ActualizarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.EliminarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.RegistrarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.ActualizarUnidadEquipoRequest;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.CrearUnidadEquipoRequest;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.UnidadEquipoResponse;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.mapper.UnidadEquipoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CRUD REST de la entidad padre de la relación 1:N.
 * CORS se configura una sola vez en shared.config.CorsConfig.
 */
@RestController
@RequestMapping("/api/unidades-equipo")
public class UnidadEquipoController {

    private final RegistrarUnidadEquipoUseCase registrarUseCase;
    private final ConsultarUnidadEquipoUseCase consultarUseCase;
    private final ActualizarUnidadEquipoUseCase actualizarUseCase;
    private final EliminarUnidadEquipoUseCase eliminarUseCase;

    public UnidadEquipoController(RegistrarUnidadEquipoUseCase registrarUseCase,
                                  ConsultarUnidadEquipoUseCase consultarUseCase,
                                  ActualizarUnidadEquipoUseCase actualizarUseCase,
                                  EliminarUnidadEquipoUseCase eliminarUseCase) {
        this.registrarUseCase = registrarUseCase;
        this.consultarUseCase = consultarUseCase;
        this.actualizarUseCase = actualizarUseCase;
        this.eliminarUseCase = eliminarUseCase;
    }

    // POST /api/unidades-equipo -> 201 Created | 400 validación | 409 número de serie duplicado
    @PostMapping
    public ResponseEntity<UnidadEquipoResponse> crear(@Valid @RequestBody CrearUnidadEquipoRequest request) {
        UnidadEquipo dominio = UnidadEquipoWebMapper.toDomain(request);
        UnidadEquipo guardado = registrarUseCase.registrar(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(UnidadEquipoWebMapper.toResponse(guardado));
    }

    // GET /api/unidades-equipo/{id} -> 200 | 404 con cuerpo ApiError
    @GetMapping("/{id}")
    public ResponseEntity<UnidadEquipoResponse> buscarPorId(@PathVariable Long id) {
        UnidadEquipo unidad = consultarUseCase.buscarPorId(id)
                .orElseThrow(() -> new UnidadEquipoNoEncontradaException(id));
        return ResponseEntity.ok(UnidadEquipoWebMapper.toResponse(unidad));
    }

    // GET /api/unidades-equipo?estado=DISPONIBLE -> 200
    @GetMapping
    public ResponseEntity<List<UnidadEquipoResponse>> listar(@RequestParam(required = false) String estado) {
        List<UnidadEquipoResponse> lista = consultarUseCase.listar(estado).stream()
                .map(UnidadEquipoWebMapper::toResponse)
                .toList();
        return ResponseEntity.ok(lista);
    }

    // PUT /api/unidades-equipo/{id} -> 200 | 400 | 404 | 409 número de serie de otra unidad
    @PutMapping("/{id}")
    public ResponseEntity<UnidadEquipoResponse> actualizar(@PathVariable Long id,
                                                           @Valid @RequestBody ActualizarUnidadEquipoRequest request) {
        UnidadEquipo actualizada = actualizarUseCase.actualizar(id, UnidadEquipoWebMapper.toDomain(request));
        return ResponseEntity.ok(UnidadEquipoWebMapper.toResponse(actualizada));
    }

    // DELETE /api/unidades-equipo/{id} -> 204 | 404 | 409 si tiene mantenimientos asociados
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        eliminarUseCase.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
