package com.equiprent.mantenimiento.application.service;

import com.equiprent.mantenimiento.domain.exception.FotoInvalidaException;
import com.equiprent.mantenimiento.domain.exception.MantenimientoNoEncontradoException;
import com.equiprent.mantenimiento.domain.model.FotoEvidencia;
import com.equiprent.mantenimiento.domain.port.in.ConsultarMantenimientoUseCase;
import com.equiprent.mantenimiento.domain.port.out.FotoStoragePort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

/**
 * Reglas de las fotos de evidencia (Guía 13):
 *  - la orden debe existir (404),
 *  - máximo 4 MB y no vacía (400),
 *  - el CONTENIDO debe ser JPEG o PNG: se revisan los "bytes mágicos", no la extensión
 *    ni el Content-Type que manda el cliente (ambos se pueden falsificar),
 *  - el nombre en disco lo genera el servidor (UUID): nunca se usa el nombre del cliente.
 */
@Service
public class FotoEvidenciaService {

    public static final long TAMANO_MAXIMO = 4_000_000;
    /** Solo nombres generados por el servidor: evita rutas como ../../etc/passwd. */
    private static final Pattern NOMBRE_VALIDO =
            Pattern.compile("^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(jpg|png)$");

    private final ConsultarMantenimientoUseCase consultar;
    private final FotoStoragePort storage;

    public FotoEvidenciaService(ConsultarMantenimientoUseCase consultar, FotoStoragePort storage) {
        this.consultar = consultar;
        this.storage = storage;
    }

    public FotoEvidencia subir(Long mantenimientoId, byte[] bytes) {
        exigirMantenimiento(mantenimientoId);
        if (bytes == null || bytes.length == 0) {
            throw new FotoInvalidaException("La imagen está vacía");
        }
        if (bytes.length > TAMANO_MAXIMO) {
            throw new FotoInvalidaException("La imagen supera el máximo de 4 MB");
        }
        String extension = detectarExtension(bytes);
        if (extension == null) {
            throw new FotoInvalidaException("Solo se aceptan imágenes JPEG o PNG verificables");
        }
        return storage.guardar(mantenimientoId, bytes, extension);
    }

    public List<FotoEvidencia> listar(Long mantenimientoId) {
        exigirMantenimiento(mantenimientoId);
        return storage.listar(mantenimientoId);
    }

    public byte[] leer(Long mantenimientoId, String filename) {
        exigirMantenimiento(mantenimientoId);
        if (!NOMBRE_VALIDO.matcher(filename).matches()) {
            throw new FotoInvalidaException("Nombre de archivo no válido");
        }
        return storage.leer(mantenimientoId, filename)
                .orElseThrow(() -> new FotoNoEncontradaException(filename));
    }

    private void exigirMantenimiento(Long id) {
        if (consultar.buscarPorId(id).isEmpty()) {
            throw new MantenimientoNoEncontradoException(id);
        }
    }

    /** JPEG empieza con FF D8 FF; PNG con 89 50 4E 47 0D 0A 1A 0A. */
    static String detectarExtension(byte[] b) {
        boolean jpg = b.length > 3 && (b[0] & 0xff) == 0xff && (b[1] & 0xff) == 0xd8 && (b[2] & 0xff) == 0xff;
        boolean png = b.length > 8 && (b[0] & 0xff) == 0x89 && b[1] == 0x50 && b[2] == 0x4e && b[3] == 0x47
                && b[4] == 0x0d && b[5] == 0x0a && b[6] == 0x1a && b[7] == 0x0a;
        return jpg ? "jpg" : png ? "png" : null;
    }

    /** 404 cuando el archivo pedido no existe para esa orden. */
    public static class FotoNoEncontradaException
            extends com.equiprent.shared.domain.exception.RecursoNoEncontradoException {
        public FotoNoEncontradaException(String filename) {
            super("No existe la foto: " + filename);
        }
    }
}
