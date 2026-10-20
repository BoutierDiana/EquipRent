package com.equiprent.unidadequipo.application.service;

import com.equiprent.unidadequipo.domain.exception.NumeroSerieDuplicadoException;
import com.equiprent.unidadequipo.domain.exception.UnidadEquipoConDependenciasException;
import com.equiprent.unidadequipo.domain.exception.UnidadEquipoNoEncontradaException;
import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.out.UnidadEquipoRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UnidadEquipoServiceTest {

    @Mock
    private UnidadEquipoRepositoryPort repositoryPort;

    @InjectMocks
    private UnidadEquipoService service;

    private static final OffsetDateTime CREADA = OffsetDateTime.parse("2026-09-01T08:00:00-04:00");

    private UnidadEquipo unidad(Long id, String serie, String estado) {
        return new UnidadEquipo(id, 1L, serie, estado, new BigDecimal("12.50"), "Notas", true, CREADA);
    }

    @Test
    void registrarRechazaNumeroSerieDuplicado() {
        when(repositoryPort.existePorNumeroSerie("SN-MAK-000124")).thenReturn(true);

        assertThatThrownBy(() -> service.registrar(unidad(null, "SN-MAK-000124", "DISPONIBLE")))
                .isInstanceOf(NumeroSerieDuplicadoException.class);
        verify(repositoryPort, never()).guardar(any());
    }

    @Test
    void listarFiltraPorEstadoSinDistinguirMayusculas() {
        when(repositoryPort.listarTodos()).thenReturn(List.of(
                unidad(1L, "SN-A-00001", "DISPONIBLE"),
                unidad(2L, "SN-B-00002", "EN_MANTENIMIENTO")));

        assertThat(service.listar("en_mantenimiento"))
                .extracting(UnidadEquipo::getId)
                .containsExactly(2L);
    }

    @Test
    void actualizarConservaIdYFechaDeCreacion() {
        when(repositoryPort.buscarPorId(5L)).thenReturn(Optional.of(unidad(5L, "SN-OLD-0001", "DISPONIBLE")));
        when(repositoryPort.existePorNumeroSerieEnOtraUnidad("SN-NEW-0001", 5L)).thenReturn(false);
        when(repositoryPort.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        UnidadEquipo datos = new UnidadEquipo(null, 2L, "SN-NEW-0001", "EN_USO",
                new BigDecimal("40.00"), null, false, null);
        service.actualizar(5L, datos);

        ArgumentCaptor<UnidadEquipo> captor = ArgumentCaptor.forClass(UnidadEquipo.class);
        verify(repositoryPort).guardar(captor.capture());
        UnidadEquipo guardada = captor.getValue();
        assertThat(guardada.getId()).isEqualTo(5L);
        assertThat(guardada.getCreatedAt()).isEqualTo(CREADA);
        assertThat(guardada.getEstadoOperativo()).isEqualTo("EN_USO");
        assertThat(guardada.getActivo()).isFalse();
    }

    @Test
    void actualizarUnidadInexistenteLanza404() {
        when(repositoryPort.buscarPorId(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.actualizar(99L, unidad(null, "SN-X-00001", "DISPONIBLE")))
                .isInstanceOf(UnidadEquipoNoEncontradaException.class);
    }

    @Test
    void actualizarRechazaNumeroSerieDeOtraUnidad() {
        when(repositoryPort.buscarPorId(5L)).thenReturn(Optional.of(unidad(5L, "SN-OLD-0001", "DISPONIBLE")));
        when(repositoryPort.existePorNumeroSerieEnOtraUnidad("SN-MAK-000124", 5L)).thenReturn(true);

        assertThatThrownBy(() -> service.actualizar(5L, unidad(null, "SN-MAK-000124", "DISPONIBLE")))
                .isInstanceOf(NumeroSerieDuplicadoException.class);
    }

    @Test
    void eliminarUnidadInexistenteLanza404() {
        when(repositoryPort.existePorId(99L)).thenReturn(false);

        assertThatThrownBy(() -> service.eliminar(99L))
                .isInstanceOf(UnidadEquipoNoEncontradaException.class);
        verify(repositoryPort, never()).eliminarPorId(any());
    }

    @Test
    void eliminarUnidadConMantenimientosPropagaConflicto() {
        when(repositoryPort.existePorId(3L)).thenReturn(true);
        doThrow(new UnidadEquipoConDependenciasException(3L)).when(repositoryPort).eliminarPorId(3L);

        assertThatThrownBy(() -> service.eliminar(3L))
                .isInstanceOf(UnidadEquipoConDependenciasException.class);
    }
}
