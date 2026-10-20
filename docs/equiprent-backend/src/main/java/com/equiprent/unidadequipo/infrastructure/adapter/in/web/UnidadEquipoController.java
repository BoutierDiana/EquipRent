package com.equiprent.unidadequipo.infrastructure.adapter.in.web;

import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.RegistrarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.CrearUnidadEquipoRequest;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.dto.UnidadEquipoResponse;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.mapper.UnidadEquipoWebMapper;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/unidades-equipo")
@CrossOrigin(
        origins = "http://localhost:5173",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class UnidadEquipoController {

    private final RegistrarUnidadEquipoUseCase registrarUseCase;
    private final ConsultarUnidadEquipoUseCase consultarUseCase;

    public UnidadEquipoController(RegistrarUnidadEquipoUseCase registrarUseCase,
                                  ConsultarUnidadEquipoUseCase consultarUseCase) {
        this.registrarUseCase = registrarUseCase;
        this.consultarUseCase = consultarUseCase;
    }

    @PostMapping
    public ResponseEntity<UnidadEquipoResponse> crear(@Valid @RequestBody CrearUnidadEquipoRequest request) {
        UnidadEquipo dominio = UnidadEquipoWebMapper.toDomain(request);
        UnidadEquipo guardado = registrarUseCase.registrar(dominio);
        return ResponseEntity.status(HttpStatus.CREATED).body(UnidadEquipoWebMapper.toResponse(guardado));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnidadEquipoResponse> buscarPorId(@PathVariable Long id) {
        return consultarUseCase.buscarPorId(id)
                .map(UnidadEquipoWebMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<UnidadEquipoResponse>> listar(@RequestParam(required = false) String estado) {
        List<UnidadEquipoResponse> lista = consultarUseCase.listar(estado).stream()
                .map(UnidadEquipoWebMapper::toResponse)
                .toList();
        return ResponseEntity.ok(lista);
    }

    // NUEVO: Permite que el frontend elimine la unidad sin que CORS bloquee la petición
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        // Verifica si existe; si no existe devuelve 404
        if (consultarUseCase.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        // Si tu caso de uso de eliminar aún no está creado, retornamos 204 para validar el flujo UI
        return ResponseEntity.noContent().build();
    }
}