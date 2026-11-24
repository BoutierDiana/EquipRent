package com.equiprent.shared.security;

import com.equiprent.auth.web.AuthController;
import com.equiprent.unidadequipo.domain.port.in.ActualizarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.ConsultarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.EliminarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.domain.port.in.RegistrarUnidadEquipoUseCase;
import com.equiprent.unidadequipo.infrastructure.adapter.in.web.UnidadEquipoController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Guía 11: con equiprent.security.required=true la API exige JWT.
 * Usa la configuración REAL (JwtSecurityConfig) con una cuenta de prueba.
 */
@WebMvcTest(controllers = {AuthController.class, UnidadEquipoController.class})
@Import({JwtSecurityConfig.class, JsonAuthenticationEntryPoint.class})
@TestPropertySource(properties = {
        "equiprent.security.required=true",
        "equiprent.demo.user=tester",
        "equiprent.demo.password=Clave-de-prueba-1",
        "equiprent.jwt.secret=clave-de-prueba-de-al-menos-32-bytes-ok",
        "equiprent.jwt.minutes=5"
})
class SeguridadJwtTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private RegistrarUnidadEquipoUseCase registrarUseCase;
    @MockBean private ConsultarUnidadEquipoUseCase consultarUseCase;
    @MockBean private ActualizarUnidadEquipoUseCase actualizarUseCase;
    @MockBean private EliminarUnidadEquipoUseCase eliminarUseCase;

    private String login(String usuario, String clave) throws Exception {
        String cuerpo = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"" + usuario + "\",\"password\":\"" + clave + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(300))
                .andReturn().getResponse().getContentAsString();
        return cuerpo.replaceAll(".*\"accessToken\":\"([^\"]+)\".*", "$1");
    }

    @Test
    void loginCorrectoDevuelveTokenYPermiteConsultar() throws Exception {
        when(consultarUseCase.listar(any())).thenReturn(List.of());
        String token = login("tester", "Clave-de-prueba-1");

        mockMvc.perform(get("/api/unidades-equipo").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    void loginIncorrectoDevuelve401ConApiError() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"tester\",\"password\":\"mala\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Usuario o contraseña incorrectos"));
    }

    @Test
    void loginSinCamposDevuelve400() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"\",\"password\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.username").exists());
    }

    @Test
    void sinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/unidades-equipo"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.message").value("Se requiere iniciar sesión (falta el token)"));
    }

    @Test
    void tokenFalsoDevuelve401() throws Exception {
        mockMvc.perform(get("/api/unidades-equipo").header("Authorization", "Bearer abc.def.ghi"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("El token es inválido o expiró: vuelve a iniciar sesión"));
    }
}
