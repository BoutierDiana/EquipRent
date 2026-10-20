package com.equiprent.unidadequipo.infrastructure.adapter.in.web;

import com.equiprent.unidadequipo.domain.exception.NumeroSerieDuplicadoException;
import com.equiprent.unidadequipo.domain.exception.UnidadEquipoConDependenciasException;
import com.equiprent.unidadequipo.domain.model.UnidadEquipo;
import com.equiprent.unidadequipo.domain.port.in.ActualizarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.EliminarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.RegistrarUnidadEquipoUseCase;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Prueba la capa web aislada (sin base de datos): contrato HTTP y mapeo de errores a 400/404/409.
 */
@WebMvcTest(UnidadEquipoController.class)
class UnidadEquipoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private RegistrarUnidadEquipoUseCase registrarUseCase;
    @MockBean private ConsultarUnidadEquipoUseCase consultarUseCase;
    @MockBean private ActualizarUnidadEquipoUseCase actualizarUseCase;
    @MockBean private EliminarUnidadEquipoUseCase eliminarUseCase;

    private static final String CUERPO_VALIDO = """
            {"equipoId":1,"numeroSerie":"SN-NEW-0001","estadoOperativo":"DISPONIBLE",
             "metricaUsoAcumulada":0,"notasEstado":null}
            """;

    @Test
    void crearDevuelve201ConLaUnidadGuardada() throws Exception {
        UnidadEquipo guardada = new UnidadEquipo(7L, 1L, "SN-NEW-0001", "DISPONIBLE",
                BigDecimal.ZERO, null, true, OffsetDateTime.parse("2026-10-20T08:00:00-04:00"));
        when(registrarUseCase.registrar(any())).thenReturn(guardada);

        mockMvc.perform(post("/api/unidades-equipo").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.numeroSerie").value("SN-NEW-0001"));
    }

    @Test
    void crearConEstadoFueraDelCatalogoDevuelve400ConFieldErrors() throws Exception {
        String cuerpo = CUERPO_VALIDO.replace("DISPONIBLE", "ALQUILADO");

        mockMvc.perform(post("/api/unidades-equipo").contentType(MediaType.APPLICATION_JSON).content(cuerpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.estadoOperativo").exists());
    }

    @Test
    void crearConSerieDuplicadaDevuelve409() throws Exception {
        when(registrarUseCase.registrar(any())).thenThrow(new NumeroSerieDuplicadoException("SN-NEW-0001"));

        mockMvc.perform(post("/api/unidades-equipo").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    void buscarInexistenteDevuelve404ConApiError() throws Exception {
        when(consultarUseCase.buscarPorId(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/unidades-equipo/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("No existe la unidad de equipo con ID: 99"));
    }

    @Test
    void idNoNumericoDevuelve400() throws Exception {
        mockMvc.perform(get("/api/unidades-equipo/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void eliminarConMantenimientosDevuelve409() throws Exception {
        doThrow(new UnidadEquipoConDependenciasException(3L)).when(eliminarUseCase).eliminar(3L);

        mockMvc.perform(delete("/api/unidades-equipo/3"))
                .andExpect(status().isConflict());
    }

    @Test
    void eliminarExitosoDevuelve204() throws Exception {
        mockMvc.perform(delete("/api/unidades-equipo/4"))
                .andExpect(status().isNoContent());
    }
}
