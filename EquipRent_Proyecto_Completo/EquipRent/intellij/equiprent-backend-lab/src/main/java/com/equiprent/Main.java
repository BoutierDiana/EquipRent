package com.equiprent;

import com.equiprent.equipment.application.EquipoService;
import com.equiprent.equipment.domain.Equipo;
import com.equiprent.equipment.infrastructure.memory.EquipoRepositoryEnMemoria;
import com.equiprent.unit.application.command.RegistrarUnidadEquipoCommand;
import com.equiprent.unit.domain.EstadoUnidad;
import com.equiprent.unit.domain.UnidadEquipo;

import java.math.BigDecimal;

public class Main {

    public static void main(String[] args) {
        var repository = new EquipoRepositoryEnMemoria();
        var service = new EquipoService(repository);

        System.out.println("=== Capítulo 01: modelo y relación 1:N ===");
        Equipo taladro = service.registrar(
                new Equipo(1L, 1L, "eq-tal-001", "Taladro percutor 800W", "Bosch", "GSB 13 RE"));
        Equipo generador = service.registrar(
                new Equipo(2L, 3L, "EQ-GEN-001", "Generador 5 kVA", "Honda", "EG5000"));

        var comando = new RegistrarUnidadEquipoCommand(1L, "UN-TAL-001-01", "BSH-2024-0001",
                new BigDecimal("950.00"));
        taladro.agregarUnidad(new UnidadEquipo(10L, comando.equipoId(), comando.codigoUnidad(),
                comando.numeroSerie(), EstadoUnidad.DISPONIBLE, comando.valorReferencial()));
        taladro.agregarUnidad(new UnidadEquipo(11L, 1L, "UN-TAL-001-02", "BSH-2024-0002",
                EstadoUnidad.DISPONIBLE, new BigDecimal("950.00")));
        taladro.getUnidades().get(1).bloquear();

        System.out.println(taladro);
        taladro.getUnidades().forEach(u -> System.out.println("  -> " + u));
        System.out.println("Resumen: " + taladro.toResumen());

        System.out.println();
        System.out.println("=== Capítulo 02: servicio, Optional y excepciones ===");
        System.out.println("Equipos registrados: " + service.listar().size());
        System.out.println("Buscar id 2: " + service.obtener(2L));

        probar("obtener id inexistente", () -> service.obtener(999L));
        probar("código de equipo duplicado", () -> service.registrar(
                new Equipo(3L, 1L, "EQ-TAL-001", "Otro taladro", null, null)));
        probar("unidad repetida en el equipo", () -> taladro.agregarUnidad(
                new UnidadEquipo(12L, 1L, "UN-TAL-001-01", null, null, null)));
        probar("unidad de otro equipo", () -> generador.agregarUnidad(
                new UnidadEquipo(13L, 1L, "UN-TAL-001-03", null, null, null)));
        probar("código de unidad vacío (RN-01)", () ->
                new UnidadEquipo(14L, 2L, "  ", null, null, null));
        probar("transición inválida", () -> {
            var baja = new UnidadEquipo(15L, 2L, "UN-GEN-001-09", null, EstadoUnidad.BAJA, null);
            baja.enviarAMantenimiento();
        });

        // Intentar modificar la lista devuelta: debe fallar (colección protegida)
        probar("modificar lista inmodificable", () -> taladro.getUnidades().clear());
    }

    private static void probar(String caso, Runnable accion) {
        try {
            accion.run();
            System.out.println("[SIN ERROR] " + caso);
        } catch (RuntimeException ex) {
            System.out.println("ERROR CONTROLADO (" + caso + "): "
                    + ex.getClass().getSimpleName() + " -> " + ex.getMessage());
        }
    }
}
