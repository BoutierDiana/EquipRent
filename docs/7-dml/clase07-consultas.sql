-- clase07-consultas.sql
-- EquipRent — consultas mínimas de estudio (Clase 07)
-- Cada consulta responde una pregunta real del negocio del proyecto.

-- Q01. ¿Qué unidades de equipo existen, ordenadas por estado?
-- (Listado ordenado)
SELECT id, equipo_id, codigo_inventario, estado
FROM unidad_equipo
ORDER BY estado;

-- Q02. ¿Qué unidades están actualmente disponibles para alquilar?
-- (Filtro simple)
SELECT id, codigo_inventario, equipo_id
FROM unidad_equipo
WHERE estado = 'DISPONIBLE';

-- Q03. ¿Qué equipos tienen una tarifa diaria mayor a 40?
-- (Filtro simple)
SELECT id, codigo_modelo, nombre, tarifa_dia
FROM equipo
WHERE tarifa_dia > 40;

-- Q04. ¿Qué unidades están disponibles Y pertenecen al equipo con id 1?
-- (AND)
SELECT id, codigo_inventario, estado
FROM unidad_equipo
WHERE estado = 'DISPONIBLE' AND equipo_id = 1;

-- Q05. ¿Qué unidades están bloqueadas para alquiler (en mantenimiento o dadas de baja)?
-- (IN)
SELECT id, codigo_inventario, estado
FROM unidad_equipo
WHERE estado IN ('EN_MANTENIMIENTO', 'DE_BAJA');

-- Q06. ¿Qué reservas tienen un depósito entre 100 y 200 (inclusive)?
-- (BETWEEN)
SELECT id, cliente_id, unidad_equipo_id, deposito
FROM reserva
WHERE deposito BETWEEN 100 AND 200;

-- Q07. ¿Qué clientes tienen un nombre que contiene "Andina" (ej. empresas constructoras)?
-- (LIKE / ILIKE)
SELECT id, nombre_completo, documento_identidad
FROM cliente
WHERE nombre_completo ILIKE '%Andina%';

-- Q08. ¿Qué clientes no registraron correo electrónico?
-- (IS NULL)
SELECT id, nombre_completo, email
FROM cliente
WHERE email IS NULL;

-- Q09. ¿Qué reservas están confirmadas o pendientes, ordenadas por fecha de inicio?
-- (OR + ORDER BY — vinculada a la necesidad de un operador de ver la agenda próxima)
SELECT id, cliente_id, unidad_equipo_id, fecha_inicio, estado
FROM reserva
WHERE estado = 'CONFIRMADA' OR estado = 'PENDIENTE'
ORDER BY fecha_inicio;

-- =========================================================
-- Paso 7 (UPDATE seguro): regla SELECT -> UPDATE -> SELECT
-- =========================================================

-- 1. Identifica la fila
SELECT id, estado
FROM reserva
WHERE id = 3;

-- 2. Modifica con condición
UPDATE reserva
SET estado = 'CONFIRMADA'
WHERE id = 3;

-- 3. Verifica
SELECT id, estado
FROM reserva
WHERE id = 3;

-- =========================================================
-- Decisión sobre DELETE en EquipRent
-- =========================================================
-- Las reservas son un registro histórico/transaccional (RN de trazabilidad de alquileres):
-- no se eliminan físicamente. Una reserva cancelada cambia su columna `estado` a 'CANCELADA'
-- en lugar de borrarse, para conservar el historial de uso de cada unidad_equipo.
-- Ejemplo de cancelación segura (equivalente a "borrado lógico"):
-- UPDATE reserva SET estado = 'CANCELADA' WHERE id = 3;
