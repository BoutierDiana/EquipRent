-- =============================================================================
-- class08_joins.sql: Consultas Relacionales con JOIN - EquipRent
-- Proyecto: EquipRent
-- =============================================================================

SET search_path TO equiprent, public;

-- Q1. ¿A qué categoría pertenece cada modelo de equipo registrado en el catálogo?
-- Relaciones: equipo.categoria_equipo_id -> categoria_equipo.categoria_equipo_id
-- Cada fila representa: Un modelo de equipo junto con el código de modelo y nombre de su categoría padre.
SELECT
    e.equipo_id,
    e.codigo_modelo,
    e.nombre AS nombre_equipo,
    e.marca,
    c.nombre AS nombre_categoria
FROM equiprent.equipo e
INNER JOIN equiprent.categoria_equipo c
    ON c.categoria_equipo_id = e.categoria_equipo_id
ORDER BY c.nombre, e.nombre;


-- Q2. ¿Qué unidades físicas y modelos de equipo componen cada reserva registrada?
-- Relaciones: reserva_detalle.unidad_equipo_id -> unidad_equipo.unidad_equipo_id
--             unidad_equipo.equipo_id -> equipo.equipo_id
-- Cada fila representa: Una unidad de equipo específica comprometida dentro del detalle de una reserva con su modelo comercial.
SELECT
    rd.reserva_id,
    u.unidad_equipo_id,
    u.numero_serie,
    e.nombre AS modelo_equipo,
    e.marca,
    rd.precio_pactado
FROM equiprent.reserva_detalle rd
INNER JOIN equiprent.unidad_equipo u
    ON u.unidad_equipo_id = rd.unidad_equipo_id
INNER JOIN equiprent.equipo e
    ON e.equipo_id = u.equipo_id
ORDER BY rd.reserva_id;


-- Q3. ¿Qué unidades físicas disponibles pertenecen a una categoría de herramientas eléctricas?
-- Relaciones: unidad_equipo.equipo_id -> equipo.equipo_id
--             equipo.categoria_equipo_id -> categoria_equipo.categoria_equipo_id
-- Cada fila representa: Una unidad física apta para alquiler que pertenece a una categoría comercial específica.
SELECT
    u.unidad_equipo_id,
    u.numero_serie,
    u.estado_operativo,
    e.nombre AS modelo_equipo,
    c.nombre AS nombre_categoria
FROM equiprent.unidad_equipo u
INNER JOIN equiprent.equipo e
    ON e.equipo_id = u.equipo_id
INNER JOIN equiprent.categoria_equipo c
    ON c.categoria_equipo_id = e.categoria_equipo_id
WHERE c.nombre ILIKE '%eléctrica%'
  AND u.estado_operativo = 'DISPONIBLE';


-- Q4. ¿Qué modelos de equipo existen en el catálogo y qué unidades físicas tienen asignadas en inventario?
-- Relaciones: equipo.equipo_id <- unidad_equipo.equipo_id
-- Cada fila representa: Un modelo de equipo con los datos de su unidad física, mostrando NULL en los campos de unidad si aún no tiene existencias.
SELECT
    e.equipo_id,
    e.codigo_modelo,
    e.nombre AS nombre_equipo,
    u.unidad_equipo_id,
    u.numero_serie,
    u.estado_operativo
FROM equiprent.equipo e
LEFT JOIN equiprent.unidad_equipo u
    ON u.equipo_id = e.equipo_id
ORDER BY e.codigo_modelo;


-- Q5. ¿Cuáles son los modelos de equipo que NO tienen ninguna unidad física registrada en el inventario?
-- Relaciones: equipo.equipo_id <- unidad_equipo.equipo_id
-- Cada fila representa: Un modelo de catálogo que no cuenta todavía con stock físico disponible para alquilar.
SELECT
    e.equipo_id,
    e.codigo_modelo,
    e.nombre AS modelo_sin_unidades,
    e.marca
FROM equiprent.equipo e
LEFT JOIN equiprent.unidad_equipo u
    ON u.equipo_id = e.equipo_id
WHERE u.unidad_equipo_id IS NULL;


-- Q6. ¿Cuál es el estado de las reservas junto con el cliente responsable y el estado de su depósito de garantía?
-- Relaciones: reserva.cliente_id -> cliente.cliente_id
--             reserva.reserva_id <- deposito.reserva_id
-- Cada fila representa: Una reserva registrada en el sistema vinculada a los datos de contacto de su cliente y la garantía financiera asociada.
SELECT
    r.reserva_id,
    r.codigo_reserva,
    r.estado AS estado_reserva,
    r.fecha_inicio_programada,
    r.fecha_fin_programada,
    c.nombre_completo AS cliente,
    c.telefono,
    d.monto_recibido AS deposito_garantia,
    d.estado AS estado_deposito
FROM equiprent.reserva r
INNER JOIN equiprent.cliente c
    ON c.cliente_id = r.cliente_id
LEFT JOIN equiprent.deposito d
    ON d.reserva_id = r.reserva_id
ORDER BY r.fecha_inicio_programada;