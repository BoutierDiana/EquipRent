-- =====================================================================
-- EquipRent · 03 · Verificaciones y pruebas negativas (Clases 06 · Cap. 05-07)
-- Ejecutar conectado como equiprent_admin / equiprent
-- Ejecuta cada bloque por separado (Ctrl+Enter en DataGrip).
-- =====================================================================
SET search_path TO equiprent, public;

-- ---------------------------------------------------------------------
-- 1. ¿Dónde estoy? (Cap. 05, paso 4)
-- ---------------------------------------------------------------------
SELECT current_database() AS base_actual,
       current_schema()   AS schema_actual,
       current_user       AS usuario_actual;

-- ---------------------------------------------------------------------
-- 2. Las 18 tablas
-- ---------------------------------------------------------------------
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'equiprent' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ---------------------------------------------------------------------
-- 3. Columnas reales de la tabla PADRE y DEPENDIENTE (Cap. 05, paso 9)
-- ---------------------------------------------------------------------
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'equiprent' AND table_name = 'equipo'
ORDER BY ordinal_position;

SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_schema = 'equiprent' AND table_name = 'unidad_equipo'
ORDER BY ordinal_position;

-- ---------------------------------------------------------------------
-- 4. Constraints de las dos tablas del par 1:N
-- ---------------------------------------------------------------------
SELECT conrelid::regclass AS tabla, conname AS constraint, pg_get_constraintdef(oid) AS definicion
FROM pg_constraint
WHERE conrelid IN ('equiprent.equipo'::regclass, 'equiprent.unidad_equipo'::regclass)
ORDER BY tabla, conname;

-- ---------------------------------------------------------------------
-- 5. Prueba de persistencia (Cap. 05/06): lo último guardado desde Spring
-- ---------------------------------------------------------------------
SELECT * FROM equipo ORDER BY equipo_id DESC;
SELECT * FROM unidad_equipo ORDER BY unidad_id DESC;

-- ---------------------------------------------------------------------
-- 6. JOIN obligatorio del Cap. 07: cada unidad apunta a un equipo válido
-- ---------------------------------------------------------------------
SELECT u.unidad_id,
       u.codigo_unidad,
       u.estado,
       u.equipo_id       AS fk_equipo_id,
       e.equipo_id       AS pk_equipo_id,
       e.codigo          AS codigo_equipo,
       e.nombre          AS nombre_equipo
FROM equiprent.unidad_equipo u
JOIN equiprent.equipo e
  ON e.equipo_id = u.equipo_id
ORDER BY u.unidad_id;

-- Cantidad de unidades por equipo (1:N)
SELECT e.codigo, e.nombre, COUNT(u.unidad_id) AS unidades
FROM equipo e
LEFT JOIN unidad_equipo u ON u.equipo_id = e.equipo_id
GROUP BY e.equipo_id, e.codigo, e.nombre
ORDER BY e.codigo;

-- ---------------------------------------------------------------------
-- 7. PRUEBAS NEGATIVAS (cada una DEBE fallar)
-- ---------------------------------------------------------------------

-- 7.1 UNIQUE: código de equipo repetido  -> uq_equipo_codigo
INSERT INTO equipo (categoria_id, codigo, nombre)
VALUES (1, 'EQ-TAL-001', 'Duplicado');

-- 7.2 NOT NULL: equipo sin nombre -> null value in column "nombre"
INSERT INTO equipo (categoria_id, codigo, nombre)
VALUES (1, 'EQ-XXX-999', NULL);

-- 7.3 FK: unidad con equipo inexistente -> fk_unidad_equipo_equipo
INSERT INTO unidad_equipo (equipo_id, codigo_unidad)
VALUES (99999, 'UN-FANTASMA-01');

-- 7.4 UNIQUE (RN-01): código de unidad repetido -> uq_unidad_equipo_codigo
INSERT INTO unidad_equipo (equipo_id, codigo_unidad)
VALUES (1, 'UN-TAL-001-01');

-- 7.5 CHECK: estado fuera del dominio -> ck_unidad_equipo_estado
INSERT INTO unidad_equipo (equipo_id, codigo_unidad, estado)
VALUES (1, 'UN-TAL-001-99', 'PERDIDA');

-- 7.6 CHECK: reserva con fin antes del inicio -> ck_reserva_fechas
INSERT INTO reserva (codigo, cliente_id, fecha_inicio, fecha_fin)
VALUES ('RES-MAL-01', 1, '2026-10-05 10:00-04', '2026-10-04 10:00-04');

-- 7.7 CHECK: cancelar sin motivo -> ck_reserva_motivo_cancelacion
UPDATE reserva SET estado = 'CANCELADA' WHERE codigo = 'RES-2026-0001';

-- 7.8 CHECK (RN-05): entrega excepcional sin autorizador -> ck_entrega_autorizacion
INSERT INTO entrega (reserva_id, autorizacion_excepcional)
VALUES (1, TRUE);

-- 7.9 CHECK (RN-08): depósito en cero -> ck_deposito_monto
INSERT INTO deposito (reserva_id, monto, metodo) VALUES (1, 0, 'EFECTIVO');

-- 7.10 TRIGGER (RN-10): el historial no se elimina
DELETE FROM historial_estado_unidad WHERE historial_id = 1;

-- 7.11 FK: no se puede borrar un equipo que tiene unidades
DELETE FROM equipo WHERE codigo = 'EQ-TAL-001';

-- ---------------------------------------------------------------------
-- 8. RN-02 (regla transaccional): ¿la unidad ya está comprometida en el
--    rango pedido? Esta consulta la usará el backend antes de reservar.
-- ---------------------------------------------------------------------
SELECT r.codigo, r.estado, r.fecha_inicio, r.fecha_fin
FROM reserva r
JOIN reserva_detalle d ON d.reserva_id = r.reserva_id
WHERE d.unidad_id = (SELECT unidad_id FROM unidad_equipo WHERE codigo_unidad = 'UN-PRO-001-01')
  AND r.estado IN ('PENDIENTE','CONFIRMADA','EN_CURSO')          -- RN-09: canceladas no bloquean
  AND r.fecha_inicio < TIMESTAMPTZ '2026-10-02 18:00-04'          -- fin solicitado
  AND r.fecha_fin    > TIMESTAMPTZ '2026-10-02 08:00-04';         -- inicio solicitado

-- ---------------------------------------------------------------------
-- 9. RF-15: historial de una unidad
-- ---------------------------------------------------------------------
SELECT h.cambiado_at, h.estado_anterior, h.estado_nuevo, h.motivo, us.username
FROM historial_estado_unidad h
LEFT JOIN usuario us ON us.usuario_id = h.cambiado_por
WHERE h.unidad_id = 1
ORDER BY h.cambiado_at;
