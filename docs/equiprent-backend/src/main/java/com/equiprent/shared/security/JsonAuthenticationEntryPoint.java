package com.equiprent.shared.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * Responde 401 en JSON con la misma forma que ApiError, para que el móvil
 * y el frontend web lean "message" igual que en un 400/404/409.
 * Se arma a mano (sin ObjectMapper) porque el mensaje es fijo y seguro.
 */
@Component
public class JsonAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        String mensaje = request.getHeader("Authorization") == null
                ? "Se requiere iniciar sesión (falta el token)"
                : "El token es inválido o expiró: vuelve a iniciar sesión";
        String cuerpo = String.format(
                "{\"timestamp\":\"%s\",\"status\":401,\"error\":\"Unauthorized\",\"message\":\"%s\",\"path\":\"%s\",\"fieldErrors\":{}}",
                Instant.now(), mensaje, request.getRequestURI().replace("\"", ""));
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(cuerpo);
    }
}
