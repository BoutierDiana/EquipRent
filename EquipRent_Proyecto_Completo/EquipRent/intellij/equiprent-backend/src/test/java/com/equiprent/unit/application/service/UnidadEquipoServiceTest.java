package com.equiprent.unit.application.service;

import com.equiprent.equipment.domain.exception.EquipoInactivoException;
import com.equiprent.equipment.domain.exception.EquipoNoEncontradoException;
import com.equiprent.equipment.domain.model.Equipo;
import com.equiprent.equipment.domain.port.in.ConsultarEquipoUseCase;
import com.equiprent.unit.domain.exception.CodigoUnidadDuplicadoException;
import com.equiprent.unit.domain.exception.EstadoInicialInvalidoException;
import com.equiprent.unit.domain.model.EstadoUnidad;
import com.equiprent.unit.domain.model.UnidadEquipo;
import com.equiprent.unit.domain.port.out.UnidadEquipoRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

/** Prueba las reglas del caso de uso con puertos falsos: sin Spring y sin PostgreSQL. */
class UnidadEquipoServiceTest {

    private FakeUnidadRepository repository;
    private UnidadEquipoService service;

    @BeforeEach
    void setUp() {
        repository = new FakeUnidadRepository();
        var equipos = Map.of(
                1L, new Equipo(1L, 1L, "EQ-TAL-001", "Taladro", null, null, null, true),
                2L, new Equipo(2L, 1L, "EQ-OLD-001", "Equipo retirado", null, null, null, false));
        ConsultarEquipoUseCase consultarEquipo = new ConsultarEquipoUseCase() {
            @Override
            public Optional<Equipo> buscarPorId(Long id) {
                return Optional.ofNullable(equipos.get(id));
            }

            @Override
            public List<Equipo> listar(String nombre) {
                return List.copyOf(equipos.values());
            }
        };
        service = new UnidadEquipoService(repository, consultarEquipo);
    }

    private UnidadEquipo unidad(Long equipoId, String codigo, EstadoUnidad estado) {
        return new UnidadEquipo(null, equipoId, codigo, null, estado, null, new BigDecimal("100.00"), null);
    }

    @Test
    void registraUnidadValidaConEstadoDisponiblePorDefecto() {
        var creada = service.registrar(unidad(1L, "un-tal-001-01", null));
        assertNotNull(creada.getId());
        assertEquals("UN-TAL-001-01", creada.getCodigoUnidad());
        assertEquals(EstadoUnidad.DISPONIBLE, creada.getEstado());
    }

    @Test
    void rechazaEquipoInexistente() {
        assertThrows(EquipoNoEncontradoException.class,
                () -> service.registrar(unidad(99L, "UN-X-01", null)));
    }

    @Test
    void rechazaEquipoInactivo() {
        assertThrows(EquipoInactivoException.class,
                () -> service.registrar(unidad(2L, "UN-X-02", null)));
    }

    @Test
    void rechazaCodigoDuplicadoRN01() {
        service.registrar(unidad(1L, "UN-TAL-001-01", null));
        assertThrows(CodigoUnidadDuplicadoException.class,
                () -> service.registrar(unidad(1L, " un-tal-001-01 ", null)));
    }

    @Test
    void rechazaEstadoInicialNoPermitido() {
        assertThrows(EstadoInicialInvalidoException.class,
                () -> service.registrar(unidad(1L, "UN-TAL-001-05", EstadoUnidad.ENTREGADA)));
    }

    @Test
    void listaSoloLasUnidadesDelEquipo() {
        service.registrar(unidad(1L, "UN-TAL-001-01", null));
        service.registrar(unidad(1L, "UN-TAL-001-02", EstadoUnidad.MANTENIMIENTO));
        assertEquals(2, service.listarPorEquipo(1L).size());
        assertEquals(0, service.listarPorEquipo(2L).size());
    }

    /** Implementación en memoria del Port OUT, sólo para pruebas. */
    static class FakeUnidadRepository implements UnidadEquipoRepositoryPort {
        private final List<UnidadEquipo> datos = new ArrayList<>();
        private final AtomicLong secuencia = new AtomicLong();

        @Override
        public UnidadEquipo guardar(UnidadEquipo u) {
            var guardada = new UnidadEquipo(secuencia.incrementAndGet(), u.getEquipoId(),
                    u.getCodigoUnidad(), u.getNumeroSerie(), u.getEstado(),
                    u.getFechaAdquisicion(), u.getValorReferencial(), u.getObservacion());
            datos.add(guardada);
            return guardada;
        }

        @Override
        public Optional<UnidadEquipo> buscarPorId(Long id) {
            return datos.stream().filter(u -> u.getId().equals(id)).findFirst();
        }

        @Override
        public List<UnidadEquipo> listarPorEquipoId(Long equipoId) {
            return datos.stream().filter(u -> u.getEquipoId().equals(equipoId)).toList();
        }

        @Override
        public boolean existePorCodigoUnidad(String codigo) {
            return datos.stream().anyMatch(u -> u.getCodigoUnidad().equals(UnidadEquipo.normalizar(codigo)));
        }

        @Override
        public boolean existePorNumeroSerie(String serie) {
            return datos.stream().anyMatch(u -> UnidadEquipo.normalizar(serie).equals(u.getNumeroSerie()));
        }
    }
}
