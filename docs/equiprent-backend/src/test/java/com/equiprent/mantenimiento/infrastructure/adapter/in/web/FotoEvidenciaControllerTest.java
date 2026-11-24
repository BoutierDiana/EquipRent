package com.equiprent.mantenimiento.infrastructure.adapter.in.web;

import com.equiprent.mantenimiento.application.service.FotoEvidenciaService;
import com.equiprent.mantenimiento.domain.model.Mantenimiento;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.infrastructure.adapter.out.storage.FotoLocalStorageAdapter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/** Guía 13: subida de fotos con el servicio y el almacenamiento REALES (carpeta de target/). */
@WebMvcTest(FotoEvidenciaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({FotoEvidenciaService.class, FotoLocalStorageAdapter.class})
@TestPropertySource(properties = "equiprent.uploads.dir=target/test-uploads")
class FotoEvidenciaControllerTest {

    private static final byte[] JPEG = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0, 0x10, 'J', 'F', 'I', 'F'};

    @Autowired private MockMvc mockMvc;
    @MockBean private ConsultarMantenimientoUseCase consultarUseCase;

    @BeforeEach
    void existeLaOrden7() {
        when(consultarUseCase.buscarPorId(7L)).thenReturn(Optional.of(mock(Mantenimiento.class)));
        when(consultarUseCase.buscarPorId(99L)).thenReturn(Optional.empty());
    }

    @Test
    void subirJpegDevuelve201YLuegoSePuedeListarYVer() throws Exception {
        String cuerpo = mockMvc.perform(multipart("/api/mantenimientos/7/fotos")
                        .file(new MockMultipartFile("foto", "cualquiera.jpg", "image/jpeg", JPEG)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.size").value(JPEG.length))
                .andExpect(jsonPath("$.contentType").value("image/jpeg"))
                .andReturn().getResponse().getContentAsString();
        String nombre = cuerpo.replaceAll(".*\"filename\":\"([^\"]+)\".*", "$1");

        mockMvc.perform(get("/api/mantenimientos/7/fotos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.filename == '" + nombre + "')]").exists());

        mockMvc.perform(get("/api/mantenimientos/7/fotos/" + nombre))
                .andExpect(status().isOk())
                .andExpect(content().contentType("image/jpeg"))
                .andExpect(content().bytes(JPEG));
    }

    @Test
    void archivoQueNoEsImagenDevuelve400() throws Exception {
        // Dice ser image/jpeg pero el contenido es texto: se revisan los bytes, no la etiqueta.
        mockMvc.perform(multipart("/api/mantenimientos/7/fotos")
                        .file(new MockMultipartFile("foto", "foto.jpg", "image/jpeg", "hola".getBytes())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Solo se aceptan imágenes JPEG o PNG verificables"));
    }

    @Test
    void ordenInexistenteDevuelve404() throws Exception {
        mockMvc.perform(multipart("/api/mantenimientos/99/fotos")
                        .file(new MockMultipartFile("foto", "f.jpg", "image/jpeg", JPEG)))
                .andExpect(status().isNotFound());
    }

    @Test
    void sinCampoFotoDevuelve400() throws Exception {
        mockMvc.perform(multipart("/api/mantenimientos/7/fotos")
                        .file(new MockMultipartFile("otro", "f.jpg", "image/jpeg", JPEG)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Envía la imagen como multipart/form-data en el campo 'foto'"));
    }

    @Test
    void nombreManipuladoDevuelve400() throws Exception {
        mockMvc.perform(get("/api/mantenimientos/7/fotos/..%2F..%2Fsecreto.jpg"))
                .andExpect(status().isBadRequest());
    }
}
