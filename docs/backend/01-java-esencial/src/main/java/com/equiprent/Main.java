package com.equiprent;

import com.equiprent.mantenimiento.domain.Mantenimiento;
import com.equiprent.mantenimiento.domain.TipoMantenimiento;
import com.equiprent.unidad_equipo.domain.UnidadEquipo;

import java.time.LocalDate;

public class Main {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   PRUEBA DE DOMINIO EN MEMORIA - EQUIPRENT      ");
        System.out.println("==================================================");

        // ACCIÓN 1: Crear el objeto padre (UnidadEquipo)

        UnidadEquipo generador = new UnidadEquipo("GEN-HONDA-2024-01", "DISPONIBLE", 450.5);

        System.out.println("\n--- Estado Inicial de la Unidad ---");
        System.out.println("Serie: " + generador.getNumeroSerie());
        System.out.println("Estado operativo: " + generador.getEstadoOperativo());
        System.out.println("Horómetro actual: " + generador.getMetricaUsoAcumulada() + " horas");
        System.out.println("Mantenimientos previos: " + generador.getMantenimientos().size());


        // ACCIÓN 2: Crear dos objetos dependientes (Mantenimiento)

        // Mantenimiento 1: Preventivo programado
        Mantenimiento mantPreventivo = new Mantenimiento(
                generador,
                null, // danoId es null porque es mantenimiento regular
                TipoMantenimiento.PREVENTIVO,
                LocalDate.now(),
                LocalDate.now().plusDays(2)
        );

        // Mantenimiento 2: Correctivo futuro
        Mantenimiento mantCorrectivo = new Mantenimiento(
                generador,
                null,
                TipoMantenimiento.CORRECTIVO,
                LocalDate.now().plusDays(10),
                LocalDate.now().plusDays(15)
        );


        // ACCIÓN 3: Relacionarlos mediante el método de negocio

        generador.registrarMantenimiento(mantPreventivo);
        generador.registrarMantenimiento(mantCorrectivo);

        // ACCIÓN 4: Imprimir evidencia del resultado

        System.out.println("\n--- Estado Tras Registrar Mantenimientos ---");
        System.out.println("Nuevo estado operativo: " + generador.getEstadoOperativo());
        System.out.println("Cantidad de mantenimientos en historial: " + generador.getMantenimientos().size());

        System.out.println("\nDetalle de mantenimientos asignados:");
        for (Mantenimiento m : generador.getMantenimientos()) {
            System.out.println(" * Tipo: " + m.getTipo()
                    + " | Ingreso: " + m.getFechaIngreso()
                    + " | Salida estimada: " + m.getFechaEgresoEstimada()
                    + " | Estado orden: " + m.getEstado());
        }

        System.out.println("\n==================================================");
        System.out.println("   EJECUCIÓN COMPLETADA CON ÉXITO SIN SPRING      ");
        System.out.println("==================================================");
    }
}