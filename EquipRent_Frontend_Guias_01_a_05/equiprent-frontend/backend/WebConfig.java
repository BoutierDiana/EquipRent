package com.equiprent.shared.web;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Guía 05 · CORS para desarrollo.
 * Copia este archivo en equiprent-backend:
 *   src/main/java/com/equiprent/shared/web/WebConfig.java
 *
 * Sin esto, el navegador bloquea las peticiones de React (5173) al backend (8080),
 * aunque en Postman funcionen: Postman no aplica la política de origen.
 * En producción se autoriza el dominio real del frontend, nunca localhost.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
