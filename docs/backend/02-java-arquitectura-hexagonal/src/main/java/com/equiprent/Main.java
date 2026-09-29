package com.equiprent;

import com.equiprent.unidad_equipo.application.UnidadEquipoService;
import com.equiprent.unidad_equipo.domain.UnidadEquipo;
import com.equiprent.unidad_equipo.domain.port.UnidadEquipoRepository;
import com.equiprent.unidad_equipo.exception.NumeroSerieDuplicadoException;
import com.equiprent.unidad_equipo.exception.UnidadNoEncontradaException;
import com.equiprent.unidad_equipo.infrastructure.memory.UnidadEquipoRepositoryEnMemoria;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== INICIANDO SISTEMA EQUIPRENT ===");

        // 1. Instanciamos la infraestructura y la inyectamos en el servicio
        UnidadEquipoRepository repositorioEnMemoria = new UnidadEquipoRepositoryEnMemoria();
        UnidadEquipoService service = new UnidadEquipoService(repositorioEnMemoria);

        // 2. Caso de éxito: Registrar una nueva unidad
        System.out.println("\n--- Prueba 1: Registro Exitoso ---");
        UnidadEquipo unidad1 = new UnidadEquipo(
                "CAT-320D",      // Primer String (ej. Modelo/Código)
                "SN-2026-001",   // Segundo String (Número de Serie)
                150.0            // Double (Precio o Tarifa)
        );

        UnidadEquipo guardada = service.registrar(unidad1);
        System.out.println("Unidad registrada con éxito!");
        System.out.println("ID generado: " + guardada.getId());
        System.out.println("Número de Serie: " + guardada.getNumeroSerie());

        // 3. Caso de error 1: Intentar registrar el mismo número de serie
        System.out.println("\n--- Prueba 2: Validar Número de Serie Duplicado ---");
        try {
            UnidadEquipo unidadDuplicada = new UnidadEquipo(
                    "KOMATSU-PC200",
                    "SN-2026-001", // Mismo número de serie repetido
                    180.0
            );
            service.registrar(unidadDuplicada);
        } catch (NumeroSerieDuplicadoException e) {
            System.out.println("Regla de negocio validada correctamente:");
            System.out.println("Excepción capturada: " + e.getMessage());
        }

        // 4. Caso de error 2: Buscar una unidad inexistente
        System.out.println("\n--- Prueba 3: Buscar ID Inexistente ---");
        try {
            service.obtenerPorId(999L);
        } catch (UnidadNoEncontradaException e) {
            System.out.println("Regla de búsqueda validada correctamente:");
            System.out.println("Excepción capturada: " + e.getMessage());
        }

        // 5. Listar todas las unidades registradas
        System.out.println("\n--- Prueba 4: Listar Unidades ---");
        System.out.println("Total de unidades registradas: " + service.listarTodas().size());

        System.out.println("\n=== TODAS LAS PRUEBAS FINALIZADAS CON ÉXITO ===");
    }
}