package com.equiprent.shared.application;

import org.springframework.stereotype.Service;

/** Cap. 03: primer Bean de aplicación, inyectado por constructor. */
@Service
public class ProjectInfoService {

    public String projectName() {
        return "EquipRent - Alquiler de Equipos";
    }

    public String backendStage() {
        return "HEXAGONAL_RELACION_1N";
    }
}
