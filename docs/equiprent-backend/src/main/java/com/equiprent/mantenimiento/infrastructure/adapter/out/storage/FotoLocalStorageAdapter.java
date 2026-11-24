package com.equiprent.mantenimiento.infrastructure.adapter.out.storage;

import com.equiprent.mantenimiento.domain.model.FotoEvidencia;
import com.equiprent.mantenimiento.domain.port.out.FotoStoragePort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Stream;

/**
 * Adaptador de AULA: guarda las fotos en una carpeta local
 * (<equiprent.uploads.dir>/mantenimientos/<id>/<uuid>.jpg).
 * En producción se reemplaza por S3/Blob Storage sin tocar el servicio (mismo puerto).
 */
@Component
public class FotoLocalStorageAdapter implements FotoStoragePort {

    private final Path raiz;

    public FotoLocalStorageAdapter(@Value("${equiprent.uploads.dir:archivos-dev}") String directorio) {
        this.raiz = Path.of(directorio).toAbsolutePath().normalize();
    }

    private Path carpeta(Long mantenimientoId) {
        return raiz.resolve("mantenimientos").resolve(String.valueOf(mantenimientoId));
    }

    @Override
    public FotoEvidencia guardar(Long mantenimientoId, byte[] bytes, String extension) {
        try {
            Path carpeta = carpeta(mantenimientoId);
            Files.createDirectories(carpeta);
            String nombre = UUID.randomUUID() + "." + extension;
            Path destino = carpeta.resolve(nombre);
            Files.write(destino, bytes);
            return aFoto(destino);
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo guardar la foto", e);
        }
    }

    @Override
    public List<FotoEvidencia> listar(Long mantenimientoId) {
        Path carpeta = carpeta(mantenimientoId);
        if (!Files.isDirectory(carpeta)) return List.of();
        try (Stream<Path> archivos = Files.list(carpeta)) {
            return archivos.filter(Files::isRegularFile)
                    .map(this::aFoto)
                    .sorted(Comparator.comparing(FotoEvidencia::subidaEn).reversed())
                    .toList();
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo listar las fotos", e);
        }
    }

    @Override
    public Optional<byte[]> leer(Long mantenimientoId, String filename) {
        Path carpeta = carpeta(mantenimientoId);
        Path archivo = carpeta.resolve(filename).normalize();
        // Defensa extra: el archivo debe quedar DENTRO de la carpeta de esa orden.
        if (!archivo.startsWith(carpeta) || !Files.isRegularFile(archivo)) return Optional.empty();
        try {
            return Optional.of(Files.readAllBytes(archivo));
        } catch (IOException e) {
            throw new UncheckedIOException("No se pudo leer la foto", e);
        }
    }

    private FotoEvidencia aFoto(Path archivo) {
        try {
            BasicFileAttributes atributos = Files.readAttributes(archivo, BasicFileAttributes.class);
            String nombre = archivo.getFileName().toString();
            String tipo = nombre.endsWith(".png") ? "image/png" : "image/jpeg";
            return new FotoEvidencia(nombre, atributos.size(), tipo, atributos.lastModifiedTime().toInstant());
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
