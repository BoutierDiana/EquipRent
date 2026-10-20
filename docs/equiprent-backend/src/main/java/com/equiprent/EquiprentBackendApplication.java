package com.equiprent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada. Spring Boot escanea componentes, entidades JPA y repositorios
 * de Spring Data a partir de este paquete (com.equiprent) sin configuración extra.
 * Nota: no se declara @EnableJpaRepositories aquí porque obligaría a los tests
 * @WebMvcTest (que no levantan JPA) a crear un EntityManagerFactory.
 */
@SpringBootApplication
public class EquiprentBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EquiprentBackendApplication.class, args);
    }
}
