package com.equiprent.mantenimiento.domain.model;

import java.time.Instant;

/** Foto de evidencia de una orden de mantenimiento (Guía 13). */
public record FotoEvidencia(String filename, long size, String contentType, Instant subidaEn) {}
