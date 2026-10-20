package com.equiprent.mantenimiento.application.service;

import com.equiprent.mantenimiento.domain.exception.FechasMantenimientoInvalidasException;
import com.equiprent.mantenimiento.domain.exception.MantenimientoNoEncontradoException;
import com.equiprent.mantenimiento.domain.model.EstadoMantenimiento;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.model.TipoMantenimiento;
import com.equiprent.mantenimiento.domain.port.out.MantenimientoRepositoryPort;
import com.equiprent.unidadequipo.domain.exception.UnidadEquipoNoEncontradaException;
import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MantenimientoServiceTest {

    @Mock
    private MantenimientoRepositoryPort repositoryPort;

    @Mock
    private ConsultarUnidadEquipoUseCase consultarUnidadEquipoUseCase;

    @InjectMocks
    private MantenimientoService service;

    private static final OffsetDateTime INGRESO = OffsetDateTime.parse("2026-10-14T08:30:00-04:00");
    private static final OffsetDateTime CREADA = OffsetDateTime.parse("2026-10-14T08:31:00-04:00");

    private Mantenimiento orden(Long id, Long unidadId, OffsetDateTime egresoEstimada) {
        return new Mantenimiento(id, unidadId, null, TipoMantenimiento.CORRECTIVO, INGRESO,
                egresoEstimada, null, EstadoMantenimiento.EN_PROCESO, CREADA);
    }

    private UnidadEquipo unidad(Long id) {
        return new UnidadEquipo(id, 1L, "SN-HON-000301", "EN_MANTENIMIENTO", BigDecimal.TEN, null, true, CREADA);
    }

    @Test
    void registrarRechazaUnidadInexistente() {
        when(consultarUnidadEquipoUseCase.buscarPorId(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.registrar(orden(null, 999L, INGRESO.plusDays(2))))
                .isInstanceOf(UnidadEquipoNoEncontradaException.class);
        verify(repositoryPort, never()).guardar(any());
    }

    @Test
    void registrarRechazaEgresoAnteriorAlIngreso() {
        when(consultarUnidadEquipoUseCase.buscarPorId(3L)).thenReturn(Optional.of(unidad(3L)));

        assertThatThrownBy(() -> service.registrar(orden(null, 3L, INGRESO.minusHours(4))))
                .isInstanceOf(FechasMantenimientoInvalidasException.class);
        verify(repositoryPort, never()).guardar(any());
    }

    @Test
    void actualizarPermiteReasignarLaUnidadPadre() {
        when(repositoryPort.buscarPorId(10L)).thenReturn(Optional.of(orden(10L, 3L, INGRESO.plusDays(1))));
        when(consultarUnidadEquipoUseCase.buscarPorId(4L)).thenReturn(Optional.of(unidad(4L)));
        when(repositoryPort.guardar(any())).thenAnswer(inv -> inv.getArgument(0));

        service.actualizar(10L, orden(null, 4L, INGRESO.plusDays(3)));

        ArgumentCaptor<Mantenimiento> captor = ArgumentCaptor.forClass(Mantenimiento.class);
        verify(repositoryPort).guardar(captor.capture());
        assertThat(captor.getValue().getId()).isEqualTo(10L);
        assertThat(captor.getValue().getUnidadEquipoId()).isEqualTo(4L);
        assertThat(captor.getValue().getCreatedAt()).isEqualTo(CREADA);
    }

    @Test
    void eliminarOrdenInexistenteLanza404() {
        when(repositoryPort.existePorId(77L)).thenReturn(false);

        assertThatThrownBy(() -> service.eliminar(77L))
                .isInstanceOf(MantenimientoNoEncontradoException.class);
    }
}
