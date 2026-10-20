package com.equiprent.mantenimiento.infrastructure.adapter.in.web;

import com.equiprent.mantenimiento.domain.exception.FechasMantenimientoInvalidasException;
import com.equiprent.mantenimiento.domain.port.in.ActualizarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.EliminarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.in.RegistrarMantenimientoUseCase;
import com.equiprent.unidadequipo.domain.exception.UnidadEquipoNoEncontradaException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(MantenimientoController.class)
class MantenimientoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean private RegistrarMantenimientoUseCase registrarUseCase;
    @MockBean private ConsultarMantenimientoUseCase consultarUseCase;
    @MockBean private ActualizarMantenimientoUseCase actualizarUseCase;
    @MockBean private EliminarMantenimientoUseCase eliminarUseCase;

    private static final String CUERPO_VALIDO = """
            {"unidadEquipoId":3,"danoId":null,"tipo":"CORRECTIVO",
             "fechaIngreso":"2026-10-14T08:30:00-04:00","fechaEgresoEstimada":"2026-10-24T18:00:00-04:00",
             "fechaEgresoReal":null,"estado":"EN_PROCESO"}
            """;

    @Test
    void listarDevuelve200() throws Exception {
        when(consultarUseCase.listarTodos()).thenReturn(List.of());

        mockMvc.perform(get("/api/mantenimientos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void buscarInexistenteDevuelve404() throws Exception {
        when(consultarUseCase.buscarPorId(50L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/mantenimientos/50"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void tipoFueraDelCatalogoDevuelve400() throws Exception {
        String cuerpo = CUERPO_VALIDO.replace("CORRECTIVO", "INSPECCION");

        mockMvc.perform(post("/api/mantenimientos").contentType(MediaType.APPLICATION_JSON).content(cuerpo))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.tipo").exists());
    }

    @Test
    void fechaMalFormadaDevuelve400() throws Exception {
        String cuerpo = CUERPO_VALIDO.replace("2026-10-14T08:30:00-04:00", "14/10/2026");

        mockMvc.perform(post("/api/mantenimientos").contentType(MediaType.APPLICATION_JSON).content(cuerpo))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unidadInexistenteDevuelve404() throws Exception {
        when(registrarUseCase.registrar(any())).thenThrow(new UnidadEquipoNoEncontradaException(3L));

        mockMvc.perform(post("/api/mantenimientos").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isNotFound());
    }

    @Test
    void fechasIncoherentesDevuelven400() throws Exception {
        when(registrarUseCase.registrar(any())).thenThrow(new FechasMantenimientoInvalidasException());

        mockMvc.perform(post("/api/mantenimientos").contentType(MediaType.APPLICATION_JSON).content(CUERPO_VALIDO))
                .andExpect(status().isBadRequest());
    }
}
