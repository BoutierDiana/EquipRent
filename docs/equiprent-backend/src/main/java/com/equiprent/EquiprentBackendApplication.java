package com.equiprent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.equiprent")
@EnableJpaRepositories(basePackages = "com.equiprent")
public class EquiprentBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(EquiprentBackendApplication.class, args);
    }
}