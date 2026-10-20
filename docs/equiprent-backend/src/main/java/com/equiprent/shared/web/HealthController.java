package com.equiprent.shared.web;

import com.equiprent.shared.application.ProjectInfoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final ProjectInfoService projectInfoService;

    // Inyección por constructor (Punto 8)
    public HealthController(ProjectInfoService projectInfoService) {
        this.projectInfoService = projectInfoService;
    }

    @GetMapping
    public Map<String, Object> health() {
        return Map.of(
                "status", "OK",
                "application", projectInfoService.projectName(),
                "stage", projectInfoService.backendStage(),
                "timestamp", Instant.now().toString()
        );
    }
}