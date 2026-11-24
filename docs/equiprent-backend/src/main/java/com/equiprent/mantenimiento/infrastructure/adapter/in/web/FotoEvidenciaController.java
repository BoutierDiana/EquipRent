package com.equiprent.mantenimiento.infrastructure.adapter.in.web;

import com.equiprent.mantenimiento.application.service.FotoEvidenciaService;
import com.equiprent.mantenimiento.domain.model.FotoEvidencia;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Fotos de evidencia de una orden de mantenimiento (Guía 13):
 *   POST /api/mantenimientos/{id}/fotos            multipart "foto" -> 201 | 400 | 404 | 413
 *   GET  /api/mantenimientos/{id}/fotos            -> 200 [FotoEvidencia] | 404
 *   GET  /api/mantenimientos/{id}/fotos/{archivo}  -> 200 image/jpeg|png | 400 | 404
 */
@RestController
@RequestMapping("/api/mantenimientos/{id}/fotos")
public class FotoEvidenciaController {

    private final FotoEvidenciaService service;

    public FotoEvidenciaController(FotoEvidenciaService service) {
        this.service = service;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FotoEvidencia> subir(@PathVariable Long id,
                                               @RequestParam("foto") MultipartFile foto) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.subir(id, foto.getBytes()));
    }

    @GetMapping
    public List<FotoEvidencia> listar(@PathVariable Long id) {
        return service.listar(id);
    }

    @GetMapping("/{archivo}")
    public ResponseEntity<byte[]> ver(@PathVariable Long id, @PathVariable String archivo) {
        byte[] bytes = service.leer(id, archivo);
        MediaType tipo = archivo.endsWith(".png") ? MediaType.IMAGE_PNG : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok()
                .contentType(tipo)
                .cacheControl(CacheControl.noStore()) // evidencia privada: sin caché compartida
                .header("X-Content-Type-Options", "nosniff")
                .body(bytes);
    }
}
