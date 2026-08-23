-- V2__seed_core.sql
-- EquipRent — dataset ampliado sobre las tablas núcleo de V1
-- Orden respeta dependencias: categoria_equipo -> equipo -> unidad_equipo, cliente -> reserva

-- categoria_equipo (padre)
INSERT INTO categoria_equipo (codigo, nombre, descripcion)
VALUES
    ('CAT-02', 'Andamios', 'Estructuras modulares para trabajo en altura'),
    ('CAT-03', 'Generadores', 'Equipos de generación eléctrica portátil');

-- equipo (hija de categoria_equipo)
INSERT INTO equipo (categoria_equipo_id, codigo_modelo, nombre, marca, tarifa_dia)
VALUES
    (1, 'EQ-AMO-002', 'Amoladora angular', 'Makita', 35.00),
    (2, 'EQ-AND-001', 'Módulo de andamio 2m', 'Layher', 25.00),
    (3, 'EQ-GEN-001', 'Generador 5.5kW', 'Honda', 120.00);

-- unidad_equipo (hija de equipo)
INSERT INTO unidad_equipo (equipo_id, codigo_inventario, estado, fecha_adquisicion)
VALUES
    (1, 'INV-000124', 'DISPONIBLE', '2025-02-10'),
    (2, 'INV-000201', 'ALQUILADA', '2024-11-05'),
    (3, 'INV-000301', 'EN_MANTENIMIENTO', '2023-06-20'),
    (4, 'INV-000302', 'DISPONIBLE', '2023-06-20');

-- cliente (padre, independiente)
INSERT INTO cliente (nombre_completo, documento_identidad, telefono, email)
VALUES
    ('Valeria Rojas Camacho', '8891234', '76654321', 'valeria.rojas@example.com'),
    ('Constructora Andina SRL', '1023456019', '3334455', NULL);

-- reserva (hija de cliente y unidad_equipo)
INSERT INTO reserva (cliente_id, unidad_equipo_id, fecha_inicio, fecha_fin, estado, deposito)
VALUES
    (2, 2, '2026-09-05 09:00:00-04', '2026-09-10 17:00:00-04', 'CONFIRMADA', 150.00),
    (3, 3, '2026-09-02 08:00:00-04', '2026-09-04 08:00:00-04', 'CANCELADA', 0.00),
    (1, 5, '2026-09-15 10:00:00-04', '2026-09-16 10:00:00-04', 'PENDIENTE', 200.00);

SELECT * FROM categoria_equipo ORDER BY id;
SELECT * FROM equipo ORDER BY id;
SELECT * FROM unidad_equipo ORDER BY id;
SELECT * FROM cliente ORDER BY id;
SELECT * FROM reserva ORDER BY id;

-- Prueba de constraint sugerida (NO dejar aplicada en V2):
-- Duplicar un codigo_inventario existente para forzar violación de UNIQUE:
-- INSERT INTO unidad_equipo (equipo_id, codigo_inventario, estado)
-- VALUES (1, 'INV-000124', 'DISPONIBLE');
