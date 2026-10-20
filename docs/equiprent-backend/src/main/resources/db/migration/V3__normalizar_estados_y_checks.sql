-- =============================================================================
-- V3__normalizar_estados_y_checks.sql
-- Proyecto: EquipRent
-- Propósito: fijar los catálogos cerrados acordados en la auditoría Fase 1 y
--            protegerlos con CHECK constraints (Clase 06: "CHECK donde corresponda").
--
-- Catálogos oficiales:
--   unidad_equipo.estado_operativo -> diccionario de datos (DER lógico v0.1)
--       DISPONIBLE, RESERVADA, EN_USO, EN_MANTENIMIENTO, DE_BAJA
--   mantenimiento.tipo             -> enum Java TipoMantenimiento
--       PREVENTIVO, CORRECTIVO
--   mantenimiento.estado           -> enum Java EstadoMantenimiento
--       EN_PROCESO, COMPLETADO, CANCELADO
-- =============================================================================

-- 1. Normalización de datos previos -------------------------------------------
-- Antes de esta migración el backend aceptaba cualquier texto en estado_operativo
-- y el frontend ofrecía valores fuera del diccionario. Se traducen a su
-- equivalente oficial para que los CHECK puedan crearse sin fallar.

-- 1.1 Mayúsculas y sin espacios accidentales.
UPDATE equiprent.unidad_equipo SET estado_operativo = UPPER(BTRIM(estado_operativo))
WHERE estado_operativo <> UPPER(BTRIM(estado_operativo));

UPDATE equiprent.mantenimiento SET tipo = UPPER(BTRIM(tipo))
WHERE tipo <> UPPER(BTRIM(tipo));

UPDATE equiprent.mantenimiento SET estado = UPPER(BTRIM(estado))
WHERE estado <> UPPER(BTRIM(estado));

-- 1.2 Sinónimos usados antes de fijar el catálogo.
UPDATE equiprent.unidad_equipo SET estado_operativo = 'EN_USO'
WHERE estado_operativo IN ('ALQUILADO', 'ALQUILADA');

UPDATE equiprent.unidad_equipo SET estado_operativo = 'EN_MANTENIMIENTO'
WHERE estado_operativo IN ('EN_TALLER', 'EN_REVISION');

UPDATE equiprent.unidad_equipo SET estado_operativo = 'DE_BAJA'
WHERE estado_operativo = 'BAJA';

-- 1.3 Cualquier otro valor fuera del catálogo vuelve a DISPONIBLE, pero el valor
--     anterior queda registrado en notas_estado para no perder información.
UPDATE equiprent.unidad_equipo
SET notas_estado = COALESCE(notas_estado || ' | ', '') || 'Estado previo no válido: ' || estado_operativo,
    estado_operativo = 'DISPONIBLE'
WHERE estado_operativo NOT IN ('DISPONIBLE', 'RESERVADA', 'EN_USO', 'EN_MANTENIMIENTO', 'DE_BAJA');

-- 1.4 Órdenes creadas antes de validar fechas (el formulario anterior podía guardar
--     una egreso estimada anterior al ingreso por diferencia de zona horaria).
UPDATE equiprent.mantenimiento SET fecha_egreso_estimada = fecha_ingreso
WHERE fecha_egreso_estimada < fecha_ingreso;

UPDATE equiprent.mantenimiento SET fecha_egreso_real = fecha_ingreso
WHERE fecha_egreso_real IS NOT NULL AND fecha_egreso_real < fecha_ingreso;

-- 2. Dominios cerrados ---------------------------------------------------------
ALTER TABLE equiprent.unidad_equipo
    ADD CONSTRAINT ck_unidad_equipo_estado_operativo
        CHECK (estado_operativo IN ('DISPONIBLE', 'RESERVADA', 'EN_USO', 'EN_MANTENIMIENTO', 'DE_BAJA'));

ALTER TABLE equiprent.unidad_equipo
    ADD CONSTRAINT ck_unidad_equipo_metrica_uso
        CHECK (metrica_uso_acumulada >= 0);

ALTER TABLE equiprent.mantenimiento
    ADD CONSTRAINT ck_mantenimiento_tipo
        CHECK (tipo IN ('PREVENTIVO', 'CORRECTIVO'));

ALTER TABLE equiprent.mantenimiento
    ADD CONSTRAINT ck_mantenimiento_estado
        CHECK (estado IN ('EN_PROCESO', 'COMPLETADO', 'CANCELADO'));

-- 3. Coherencia temporal de la orden de taller ---------------------------------
ALTER TABLE equiprent.mantenimiento
    ADD CONSTRAINT ck_mantenimiento_fechas
        CHECK (
            fecha_egreso_estimada >= fecha_ingreso
            AND (fecha_egreso_real IS NULL OR fecha_egreso_real >= fecha_ingreso)
        );
