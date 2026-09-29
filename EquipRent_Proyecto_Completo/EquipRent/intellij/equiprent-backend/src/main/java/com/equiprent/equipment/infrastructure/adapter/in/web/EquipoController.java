package com.equiprent.equipment.infrastructure.adapter.in.web;

import com.equiprent.equipment.domain.exception.EquipoNoEncontradoException;
import com.equiprent.equipment.domain.port.in.ConsultarEquipoUseCase;
import com.equiprent.equipment.domain.port.in.RegistrarEquipoUseCase;
import com.equiprent.equipment.infrastructure.adapter.in.web.dto.CrearEquipoRequest;
import com.equiprent.equipment.infrastructure.adapter.in.web.dto.EquipoResponse;
import com.equiprent.equipment.infrastructure.adapter.in.web.mapper.EquipoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/** Adapter IN: depende de los Ports IN, nunca del JpaRepository. */
@RestController
@RequestMapping("/api/equipos")
public class EquipoController {

    private final RegistrarEquipoUseCase registrar;
    private final ConsultarEquipoUseCase consultar;

    public EquipoController(RegistrarEquipoUseCase registrar, ConsultarEquipoUseCase consultar) {
        this.registrar = registrar;
        this.consultar = consultar;
    }

    @PostMapping
    public ResponseEntity<EquipoResponse> crear(@Valid @RequestBody CrearEquipoRequest request) {
        var creado = registrar.registrar(EquipoWebMapper.toDomain(request));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(creado.getId()).toUri();
        return ResponseEntity.created(location).body(EquipoWebMapper.toResponse(creado));
    }

    @GetMapping
    public List<EquipoResponse> listar(@RequestParam(required = false) String nombre) {
        return consultar.listar(nombre).stream()
                .map(EquipoWebMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipoResponse> buscarPorId(@PathVariable Long id) {
        var equipo = consultar.buscarPorId(id)
                .orElseThrow(() -> new EquipoNoEncontradoException(id));
        return ResponseEntity.ok(EquipoWebMapper.toResponse(equipo));
    }
}
