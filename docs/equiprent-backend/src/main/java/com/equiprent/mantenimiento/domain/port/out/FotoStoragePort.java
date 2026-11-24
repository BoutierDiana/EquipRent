package com.equiprent.mantenimiento.domain.port.out;

import com.equiprent.mantenimiento.domain.model.FotoEvidencia;

import java.util.List;
import java.util.Optional;

/** Puerto de salida: dónde se guardan físicamente los archivos (hoy, una carpeta local). */
public interface FotoStoragePort {
    FotoEvidencia guardar(Long mantenimientoId, byte[] bytes, String extension);
    List<FotoEvidencia> listar(Long mantenimientoId);
    Optional<byte[]> leer(Long mantenimientoId, String filename);
}
