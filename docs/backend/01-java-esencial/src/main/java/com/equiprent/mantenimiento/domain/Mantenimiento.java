package com.equiprent.mantenimiento.domain;

import com.equiprent.unidad_equipo.domain.UnidadEquipo;
import java.time.LocalDate;

public class Mantenimiento {


    // 1. ATRIBUTOS PRINCIPALES (Reflejo del diseño físico de mantenimiento)

    private Long id;                               // mantenimiento_id (PK)
    private UnidadEquipo unidadEquipo;             // FK obligatoria hacia la tabla padre
    private Long danoId;                           // FK opcional hacia dano (NULL si es preventivo)
    private TipoMantenimiento tipo;                // Enum (CHECK tipo en PostgreSQL)
    private LocalDate fechaIngreso;                // [NN]
    private LocalDate fechaEgresoEstimada;         // [NN]
    private LocalDate fechaEgresoReal;             // [NULL] hasta que finalice
    private EstadoMantenimiento estado;            // Enum (CHECK estado en PostgreSQL)


    // 2. CONSTRUCTOR CON REGLAS DE PROTECCIÓN (Paso 4)

    public Mantenimiento(
            UnidadEquipo unidadEquipo,
            Long danoId,
            TipoMantenimiento tipo,
            LocalDate fechaIngreso,
            LocalDate fechaEgresoEstimada
    ) {
        // Regla 1: Integridad referencial (Una orden no existe sin una unidad física)
        if (unidadEquipo == null) {
            throw new IllegalArgumentException("La unidad de equipo a mantener es obligatoria.");
        }

        // Regla 2: Obligatoriedad de datos operativos
        if (tipo == null) {
            throw new IllegalArgumentException("El tipo de mantenimiento es obligatorio.");
        }
        if (fechaIngreso == null || fechaEgresoEstimada == null) {
            throw new IllegalArgumentException("Las fechas de ingreso y egreso estimada son obligatorias.");
        }

        // Regla 3: Coherencia cronológica (Regla de negocio)
        if (fechaEgresoEstimada.isBefore(fechaIngreso)) {
            throw new IllegalArgumentException("La fecha estimada de egreso no puede ser anterior a la fecha de ingreso.");
        }

        this.unidadEquipo = unidadEquipo;
        this.danoId = danoId;
        this.tipo = tipo;
        this.fechaIngreso = fechaIngreso;
        this.fechaEgresoEstimada = fechaEgresoEstimada;
        this.estado = EstadoMantenimiento.PENDIENTE; // Estado inicial controlado por defecto
        this.fechaEgresoReal = null;
    }


    // 3. MÉTODOS DE LECTURA NECESARIOS (Getters)

    public Long getId() {
        return id;
    }

    public UnidadEquipo getUnidadEquipo() {
        return unidadEquipo;
    }

    public Long getDanoId() {
        return danoId;
    }

    public TipoMantenimiento getTipo() {
        return tipo;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public LocalDate getFechaEgresoEstimada() {
        return fechaEgresoEstimada;
    }

    public LocalDate getFechaEgresoReal() {
        return fechaEgresoReal;
    }

    public EstadoMantenimiento getEstado() {
        return estado;
    }


    // 4. COMPORTAMIENTO PROPIO (Lógica de negocio de la orden)

    public void registrarSalidaTaller(LocalDate fechaEgresoReal) {
        if (fechaEgresoReal == null) {
            throw new IllegalArgumentException("Debe especificar la fecha de salida real.");
        }
        if (fechaEgresoReal.isBefore(this.fechaIngreso)) {
            throw new IllegalArgumentException("La fecha real de salida no puede ser anterior al ingreso.");
        }
        this.fechaEgresoReal = fechaEgresoReal;
        this.estado = EstadoMantenimiento.COMPLETADO;
    }

    public void cancelarOrden() {
        if (this.estado == EstadoMantenimiento.COMPLETADO) {
            throw new IllegalStateException("No se puede cancelar un mantenimiento ya completado.");
        }
        this.estado = EstadoMantenimiento.CANCELADO;
    }
}