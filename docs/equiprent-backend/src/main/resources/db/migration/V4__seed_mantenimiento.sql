-- =============================================================================
-- V4__seed_mantenimiento.sql
-- Proyecto: EquipRent
-- Propósito: dataset mínimo de la relación principal unidad_equipo 1:N mantenimiento
--            (Clase 07 dejó la tabla vacía; sin filas la relación no se puede demostrar
--            ni en los JOIN de Clase 08 ni en el frontend).
--
-- Las unidades se ubican por numero_serie (clave natural UNIQUE) y no por id,
-- porque los ids pueden variar entre bases creadas a mano y bases creadas por Flyway.
-- Si una serie no existe, su INSERT no agrega filas (no falla).
-- =============================================================================

-- SN-HON-000301 está EN_MANTENIMIENTO según V2: tiene una orden abierta y un historial.
INSERT INTO equiprent.mantenimiento (unidad_equipo_id, dano_id, tipo, fecha_ingreso, fecha_egreso_estimada, fecha_egreso_real, estado)
SELECT u.unidad_equipo_id, NULL, 'CORRECTIVO',
       '2026-10-14 08:30:00-04', '2026-10-24 18:00:00-04', NULL, 'EN_PROCESO'
FROM equiprent.unidad_equipo u
WHERE u.numero_serie = 'SN-HON-000301';

INSERT INTO equiprent.mantenimiento (unidad_equipo_id, dano_id, tipo, fecha_ingreso, fecha_egreso_estimada, fecha_egreso_real, estado)
SELECT u.unidad_equipo_id, NULL, 'PREVENTIVO',
       '2026-07-02 09:00:00-04', '2026-07-03 17:00:00-04', '2026-07-03 15:30:00-04', 'COMPLETADO'
FROM equiprent.unidad_equipo u
WHERE u.numero_serie = 'SN-HON-000301';

-- SN-MAK-000124: mantenimiento preventivo reciente (coincide con sus notas_estado).
INSERT INTO equiprent.mantenimiento (unidad_equipo_id, dano_id, tipo, fecha_ingreso, fecha_egreso_estimada, fecha_egreso_real, estado)
SELECT u.unidad_equipo_id, NULL, 'PREVENTIVO',
       '2026-09-01 08:00:00-04', '2026-09-02 12:00:00-04', '2026-09-02 10:45:00-04', 'COMPLETADO'
FROM equiprent.unidad_equipo u
WHERE u.numero_serie = 'SN-MAK-000124';

-- SN-LAY-000201: orden cancelada porque la unidad salió en alquiler.
INSERT INTO equiprent.mantenimiento (unidad_equipo_id, dano_id, tipo, fecha_ingreso, fecha_egreso_estimada, fecha_egreso_real, estado)
SELECT u.unidad_equipo_id, NULL, 'PREVENTIVO',
       '2026-08-20 08:00:00-04', '2026-08-21 18:00:00-04', NULL, 'CANCELADO'
FROM equiprent.unidad_equipo u
WHERE u.numero_serie = 'SN-LAY-000201';

-- SN-HON-000302 queda sin órdenes a propósito: sirve para el LEFT JOIN
-- "unidades sin historial de mantenimiento" (class08_joins.sql, Q7).
