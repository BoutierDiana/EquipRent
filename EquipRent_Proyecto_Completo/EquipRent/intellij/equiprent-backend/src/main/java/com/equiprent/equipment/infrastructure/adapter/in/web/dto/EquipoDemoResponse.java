package com.equiprent.equipment.infrastructure.adapter.in.web.dto;

public record EquipoDemoResponse(
        Long id,
        String codigo,
        String nombre,
        String categoria
) {}
