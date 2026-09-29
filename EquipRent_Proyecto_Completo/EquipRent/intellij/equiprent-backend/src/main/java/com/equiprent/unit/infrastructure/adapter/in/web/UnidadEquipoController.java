package com.equiprent.unit.infrastructure.adapter.in.web;

import com.equiprent.unit.domain.exception.UnidadEquipoNoEncontradaException;
import com.equiprent.unit.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unit.domain.port.in.RegistrarUnidadEquipoUseCase;
import com.equiprent.unit.infrastructure.adapter.in.web.dto.CrearUnidadEquipoRequest;
import com.equiprent.unit.infrastructure.adapter.in.web.dto.UnidadEquipoResponse;
import com.equiprent.unit.infrastructure.adapter.in.web.mapper.UnidadEquipoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/unidades")
public class UnidadEquipoController {

    private final RegistrarUnidadEquipoUseCase registrar;
    private final ConsultarUnidadEquipoUseCase consultar;

    public UnidadEquipoController(RegistrarUnidadEquipoUseCase registrar,
                                  ConsultarUnidadEquipoUseCase consultar) {
        this.registrar = registrar;
        this.consultar = consultar;
    }

    @PostMapping
    public ResponseEntity<UnidadEquipoResponse> crear(@Valid @RequestBody CrearUnidadEquipoRequest request) {
        var creada = registrar.registrar(UnidadEquipoWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creada.getId()).toUri();
        return ResponseEntity.created(location).body(UnidadEquipoWebMapper.toResponse(creada));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadEquipoResponse> buscarPorId(@PathVariable Long id) {
        var unidad = consultar.buscarPorId(id)
                .orElseThrow(() -> new UnidadEquipoNoEncontradaException(id));
        return ResponseEntity.ok(UnidadEquipoWebMapper.toResponse(unidad));
    }

    @GetMapping("/equipo/{equipoId}")
    public List<UnidadEquipoResponse> listarPorEquipo(@PathVariable Long equipoId) {
        return consultar.listarPorEquipo(equipoId).stream()
                .map(UnidadEquipoWebMapper::toResponse)
                .toList();
    }
}
