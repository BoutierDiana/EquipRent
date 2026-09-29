package com.equiprent.equipment.infrastructure.adapter.in.web;

import com.equiprent.equipment.application.EquipoDemoService;
import com.equiprent.equipment.infrastructure.adapter.in.web.dto.EquipoDemoResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Cap. 03: GET /api/equipos/demo */
@RestController
@RequestMapping("/api/equipos")
public class EquipoDemoController {

    private final EquipoDemoService service;

    public EquipoDemoController(EquipoDemoService service) {
        this.service = service;
    }

    @GetMapping("/demo")
    public EquipoDemoResponse demo() {
        return service.obtenerDemo();
    }
}
