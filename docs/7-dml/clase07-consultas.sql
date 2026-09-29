-- =============================================================================
-- clase07-consultas.sql: Consultas mínimas de estudio (Clase 07) - EquipRent
-- Adaptado al esquema oficial equiprent de V1__init_core.sql
-- =============================================================================

SET search_path TO equiprent, public;

-- Q01. ¿Qué unidades de equipo existen, ordenadas por estado operativo?
-- (Listado ordenado)
SELECT unidad_equipo_id, equipo_id, numero_serie, estado_operativo
FROM equiprent.unidad_equipo
ORDER BY estado_operativo;

-- Q02. ¿Qué unidades están actualmente disponibles para alquilar?
-- (Filtro simple)
SELECT unidad_equipo_id, numero_serie, equipo_id
FROM equiprent.unidad_equipo
WHERE estado_operativo = 'DISPONIBLE';

-- Q03. ¿Qué equipos tienen un depósito base sugerido mayor a 100?
-- (En V1 las tarifas van en la tabla tarifa; si evaluamos tarifas diarias > 40:)
SELECT tarifa_id, equipo_id, modalidad, precio
FROM equiprent.tarifa
WHERE modalidad = 'DIARIA' AND precio > 40;

-- Q04. ¿Qué unidades están disponibles Y pertenecen al equipo con id 1?
-- (Operador AND)
SELECT unidad_equipo_id, numero_serie, estado_operativo
FROM equiprent.unidad_equipo
WHERE estado_operativo = 'DISPONIBLE' AND equipo_id = 1;

-- Q05. ¿Qué unidades están bloqueadas para alquiler (en mantenimiento o baja)?
-- (Operador IN)
SELECT unidad_equipo_id, numero_serie, estado_operativo
FROM equiprent.unidad_equipo
WHERE estado_operativo IN ('EN_MANTENIMIENTO', 'DE_BAJA');

-- Q06. ¿Qué depósitos de reserva están entre 100 y 200 (inclusive)?
-- (Operador BETWEEN sobre la tabla deposito de V1)
SELECT deposito_id, reserva_id, monto_recibido, estado
FROM equiprent.deposito
WHERE monto_recibido BETWEEN 100.00 AND 200.00;

-- Q07. ¿Qué clientes tienen un nombre que contiene "Andina" (ej. empresas constructoras)?
-- (LIKE / ILIKE)
SELECT cliente_id, nombre_completo, tipo_documento, numero_documento
FROM equiprent.cliente
WHERE nombre_completo ILIKE '%Andina%';

-- Q08. ¿Qué clientes tienen estado de crédito observado o pendiente?
-- (Nota: En V1 el email tiene NOT NULL, por lo que no hay emails nulos. Evaluamos estado_credito:)
SELECT cliente_id, nombre_completo, email, estado_credito
FROM equiprent.cliente
WHERE estado_credito = 'OBSERVADO';

-- Q09. ¿Qué reservas están confirmadas o pendientes, ordenadas por fecha de inicio?
-- (Operador OR + ORDER BY)
SELECT reserva_id, cliente_id, codigo_reserva, fecha_inicio_programada, estado
FROM equiprent.reserva
WHERE estado = 'CONFIRMADA' OR estado = 'PENDIENTE'
ORDER BY fecha_inicio_programada;

-- =============================================================================
-- Paso 7 (UPDATE seguro): Regla SELECT -> UPDATE -> SELECT
-- =============================================================================

-- 1. Identifica la fila
SELECT reserva_id, estado
FROM equiprent.reserva
WHERE reserva_id = 2;

-- 2. Modifica con condición específica
UPDATE equiprent.reserva
SET estado = 'CONFIRMADA'
WHERE reserva_id = 2;

-- 3. Verifica el cambio
SELECT reserva_id, estado
FROM equiprent.reserva
WHERE reserva_id = 2;

-- =============================================================================
-- Decisión sobre DELETE en EquipRent (Borrado lógico)
-- =============================================================================
-- Las reservas son un registro transaccional e histórico: no se eliminan físicamente.
-- Para cancelar una reserva se actualiza su estado conservando la auditoría:
UPDATE equiprent.reserva
SET estado = 'CANCELADA'
WHERE reserva_id = 2;