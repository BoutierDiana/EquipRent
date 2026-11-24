package com.equiprent.shared.security;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

/**
 * Seguridad de la API (Guía 11): JWT firmado con HMAC-SHA256, sin sesión (STATELESS).
 *
 * Rutas siempre públicas: /api/health, /api/auth/login, Swagger y los preflight OPTIONS.
 * El resto depende de equiprent.security.required:
 *   - false (por defecto): API pública, como en las Guías 08-10 (no rompe el frontend web).
 *   - true: exige "Authorization: Bearer <token>"; sin token o con token vencido -> 401.
 */
@Configuration
public class JwtSecurityConfig {

    @Bean
    SecretKey jwtSecretKey(@Value("${equiprent.jwt.secret}") String secret) {
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("equiprent.jwt.secret debe tener al menos 32 bytes para HS256");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey jwtSecretKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey));
    }

    @Bean
    JwtDecoder jwtDecoder(SecretKey jwtSecretKey) {
        return NimbusJwtDecoder.withSecretKey(jwtSecretKey).macAlgorithm(MacAlgorithm.HS256).build();
    }

    @Bean
    SecurityFilterChain apiSecurity(HttpSecurity http,
                                    JsonAuthenticationEntryPoint entryPoint,
                                    @Value("${equiprent.security.required:false}") boolean required) throws Exception {
        http.csrf(csrf -> csrf.disable()); // API REST con token, sin cookies de sesión
        http.cors(Customizer.withDefaults()); // reutiliza la política de CorsConfig
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(auth -> {
            auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
            auth.requestMatchers("/api/health", "/api/auth/login").permitAll();
            auth.requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**").permitAll();
            if (required) {
                auth.anyRequest().authenticated();
            } else {
                auth.anyRequest().permitAll();
            }
        });
        // 401 con el mismo cuerpo ApiError que el resto de la API.
        http.exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint));
        http.oauth2ResourceServer(oauth -> oauth
                .authenticationEntryPoint(entryPoint)
                .jwt(Customizer.withDefaults()));
        return http.build();
    }
}
