-- =============================================================================
-- clase06-pruebas-integridad.sql — EquipRent
-- Violaciones de integridad provocadas a propósito (Clase 06).
-- Ejecutar en DataGrip DESPUÉS de V1..V4. Cada sentencia DEBE fallar;
-- el mensaje esperado está en el comentario de cada bloque.
-- =============================================================================

SET search_path TO equiprent, public;

-- 1. UNIQUE: número de serie repetido
-- ERROR: duplicate key value violates unique constraint "uq_unidad_equipo_numero_serie"
INSERT INTO equiprent.unidad_equipo (equipo_id, numero_serie, estado_operativo)
VALUES (1, 'SN-MAK-000124', 'DISPONIBLE');

-- 2. FOREIGN KEY: unidad que apunta a un equipo inexistente
-- ERROR: insert or update on table "unidad_equipo" violates foreign key constraint "fk_unidad_equipo_equipo"
INSERT INTO equiprent.unidad_equipo (equipo_id, numero_serie, estado_operativo)
VALUES (999, 'SN-NEW-0001', 'DISPONIBLE');

-- 3. CHECK: estado fuera del catálogo oficial
-- ERROR: new row for relation "unidad_equipo" violates check constraint "ck_unidad_equipo_estado_operativo"
INSERT INTO equiprent.unidad_equipo (equipo_id, numero_serie, estado_operativo)
VALUES (1, 'SN-NEW-0002', 'ALQUILADO');

-- 4. CHECK: tipo de mantenimiento inexistente
-- ERROR: new row for relation "mantenimiento" violates check constraint "ck_mantenimiento_tipo"
INSERT INTO equiprent.mantenimiento (unidad_equipo_id, tipo, fecha_egreso_estimada, estado)
VALUES (1, 'INSPECCION', CURRENT_TIMESTAMP + INTERVAL '1 day', 'EN_PROCESO');

-- 5. CHECK: egreso estimado anterior al ingreso
-- ERROR: new row for relation "mantenimiento" violates check constraint "ck_mantenimiento_fechas"
INSERT INTO equiprent.mantenimiento (unidad_equipo_id, tipo, fecha_ingreso, fecha_egreso_estimada, estado)
VALUES (1, 'PREVENTIVO', '2026-10-20 08:00:00-04', '2026-10-19 08:00:00-04', 'EN_PROCESO');

-- 6. ON DELETE RESTRICT: borrar una unidad que tiene órdenes de mantenimiento
-- ERROR: update or delete on table "unidad_equipo" violates foreign key constraint
--        "fk_mantenimiento_unidad_equipo" on table "mantenimiento"
-- (El backend traduce este error a HTTP 409 Conflict.)
DELETE FROM equiprent.unidad_equipo WHERE numero_serie = 'SN-HON-000301';

-- 7. NOT NULL: orden sin unidad asociada
-- ERROR: null value in column "unidad_equipo_id" of relation "mantenimiento" violates not-null constraint
INSERT INTO equiprent.mantenimiento (unidad_equipo_id, tipo, fecha_egreso_estimada, estado)
VALUES (NULL, 'PREVENTIVO', CURRENT_TIMESTAMP + INTERVAL '1 day', 'EN_PROCESO');
