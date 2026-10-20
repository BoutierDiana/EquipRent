package com.equiprent.mantenimiento.infrastructure.adapter.in.web;

import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.RegistrarMantenimientoUseCase;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.CrearMantenimientoRequest;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.dto.MantenimientoResponse;
import com.equiprent.mantenimiento.infrastructure.adapter.in.web.mapper.MantenimientoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mantenimientos")
@CrossOrigin(origins = "http://localhost:5173")
public class MantenimientoController {

    private final RegistrarMantenimientoUseCase registrarUseCase;
    private final ConsultarMantenimientoUseCase consultarUseCase;

    public MantenimientoController(RegistrarMantenimientoUseCase registrarUseCase,
                                   ConsultarMantenimientoUseCase consultarUseCase) {
        this.registrarUseCase = registrarUseCase;
        this.consultarUseCase = consultarUseCase;
    }

    @PostMapping
    public ResponseEntity<MantenimientoResponse> registrar(@Valid @RequestBody CrearMantenimientoRequest request) {
        Mantenimiento dominio = MantenimientoWebMapper.toDomain(request);
        Mantenimiento guardado = registrarUseCase.registrar(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(MantenimientoWebMapper.toResponse(guardado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MantenimientoResponse> buscarPorId(@PathVariable Long id) {
        return consultarUseCase.buscarPorId(id)
                .map(MantenimientoWebMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/unidad-equipo/{unidadEquipoId}")
    public ResponseEntity<List<MantenimientoResponse>> listarPorUnidadEquipoId(@PathVariable Long unidadEquipoId) {
        List<MantenimientoResponse> lista = consultarUseCase.listarPorUnidadEquipoId(unidadEquipoId).stream()
                .map(MantenimientoWebMapper::toResponse)
                .toList();
        return ResponseEntity.ok(lista);
    }
}