package com.equiprent.equipment.application;

import com.equiprent.equipment.infrastructure.adapter.in.web.dto.EquipoDemoResponse;
import org.springframework.stereotype.Service;

/** Cap. 03: servicio temporal de demostración (sin base de datos). */
@Service
public class EquipoDemoService {

    public EquipoDemoResponse obtenerDemo() {
        return new EquipoDemoResponse(
                1L,
                "EQ-TAL-001",
                "Taladro percutor 800W",
                "Herramientas eléctricas"
        );
    }
}
