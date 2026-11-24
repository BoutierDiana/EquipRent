package com.equiprent.auth.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * POST /api/auth/login (Guía 11) -> 200 {accessToken, tokenType, expiresIn, username} | 400 | 401.
 * Cuenta de DEMOSTRACIÓN leída de application.properties; en producción se valida
 * contra una tabla de usuarios con contraseñas cifradas (BCrypt) o un IAM.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public record LoginRequest(
            @NotBlank(message = "El usuario es obligatorio") String username,
            @NotBlank(message = "La contraseña es obligatoria") String password) {}

    public record LoginResponse(String accessToken, String tokenType, long expiresIn, String username) {}

    private final JwtEncoder encoder;
    private final String demoUser;
    private final String demoPassword;
    private final long minutos;

    public AuthController(JwtEncoder encoder,
                          @Value("${equiprent.demo.user}") String demoUser,
                          @Value("${equiprent.demo.password}") String demoPassword,
                          @Value("${equiprent.jwt.minutes:30}") long minutos) {
        this.encoder = encoder;
        this.demoUser = demoUser;
        this.demoPassword = demoPassword;
        this.minutos = minutos;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest login) {
        // Comparación en tiempo constante: no revela cuántos caracteres coinciden.
        boolean usuarioOk = iguales(demoUser, login.username().trim());
        boolean claveOk = iguales(demoPassword, login.password());
        if (!usuarioOk || !claveOk) {
            throw new CredencialesInvalidasException(); // 401, mismo mensaje para usuario o clave
        }

        Instant ahora = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("equiprent-backend")
                .subject(demoUser)
                .issuedAt(ahora)
                .expiresAt(ahora.plus(minutos, ChronoUnit.MINUTES))
                .claim("scope", "read write")
                .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new LoginResponse(token, "Bearer", minutos * 60, demoUser);
    }

    private static boolean iguales(String esperado, String recibido) {
        return MessageDigest.isEqual(
                esperado.getBytes(StandardCharsets.UTF_8),
                recibido.getBytes(StandardCharsets.UTF_8));
    }
}
