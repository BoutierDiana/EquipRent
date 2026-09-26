-- =============================================================================
-- V2__seed_core.sql: Carga de Datos Iniciales (Seed Data) - EquipRent
-- Compatible estrictamente con V1__init_core.sql
-- =============================================================================

-- Establecemos el search_path para no tener que escribir equiprent. en cada tabla
SET search_path TO equiprent, public;

-- 1. USUARIOS (Requeridos como operadores y creadores de reservas)
INSERT INTO equiprent.usuario (username, email, password_hash, rol, activo)
VALUES
    ('admin_juan', 'juan.perez@equiprent.com', '$2a$12$e8Y...hash1', 'ADMINISTRADOR', TRUE),
    ('operador_ana', 'ana.gomez@equiprent.com', '$2a$12$e8Y...hash2', 'OPERADOR', TRUE),
    ('tecnico_carlos', 'carlos.mendoza@equiprent.com', '$2a$12$e8Y...hash3', 'TECNICO', TRUE);

-- 2. CLIENTE
INSERT INTO equiprent.cliente (tipo_documento, numero_documento, nombre_completo, telefono, email, estado_credito, activo)
VALUES
    ('CI', '8891234', 'Valeria Rojas Camacho', '76654321', 'valeria.rojas@example.com', 'APROBADO', TRUE),
    ('NIT', '1023456019', 'Constructora Andina SRL', '3334455', 'contacto@andina.com', 'APROBADO', TRUE),
    ('CI', '4589123', 'Roberto Mercado Silva', '71239874', 'roberto.mercado@example.com', 'OBSERVADO', TRUE);

-- 3. CATEGORIA_EQUIPO
INSERT INTO equiprent.categoria_equipo (nombre, descripcion, activo)
VALUES
    ('Herramientas Eléctricas', 'Equipos motorizados y herramientas de corte y perforación', TRUE),
    ('Andamios', 'Estructuras modulares para trabajo en altura', TRUE),
    ('Generadores', 'Equipos de generación eléctrica portátil', TRUE);

-- 4. EQUIPO (Hija de categoria_equipo)
-- Asumiendo los IDs 1, 2 y 3 generados para categoria_equipo
INSERT INTO equiprent.equipo (categoria_equipo_id, codigo_modelo, nombre, marca, descripcion, deposito_base_sugerido, activo)
VALUES
    (1, 'EQ-AMO-002', 'Amoladora angular 7"', 'Makita', 'Amoladora industrial para corte de metal y concreto', 100.00, TRUE),
    (2, 'EQ-AND-001', 'Módulo de andamio 2m', 'Layher', 'Estructura modular tubular de acero galvanizado', 150.00, TRUE),
    (3, 'EQ-GEN-001', 'Generador 5.5kW', 'Honda', 'Generador a gasolina cuatro tiempos con arranque eléctrico', 300.00, TRUE);

-- 5. TARIFA (Hija de equipo: define el costo de alquiler)
INSERT INTO equiprent.tarifa (equipo_id, modalidad, precio, vigente)
VALUES
    (1, 'DIARIA', 35.00, TRUE),
    (1, 'SEMANAL', 180.00, TRUE),
    (2, 'DIARIA', 25.00, TRUE),
    (2, 'MENSUAL', 450.00, TRUE),
    (3, 'DIARIA', 120.00, TRUE);

-- 6. UNIDAD_EQUIPO (Activos físicos individuales con número de serie)
INSERT INTO equiprent.unidad_equipo (equipo_id, numero_serie, estado_operativo, metrica_uso_acumulada, notas_estado, activo)
VALUES
    (1, 'SN-MAK-000124', 'DISPONIBLE', 12.50, 'Equipo con mantenimiento preventivo reciente', TRUE),
    (2, 'SN-LAY-000201', 'ALQUILADO', 45.00, 'Entregado en obra norte', TRUE),
    (3, 'SN-HON-000301', 'EN_MANTENIMIENTO', 180.00, 'Requiere cambio de filtro y bujías', TRUE),
    (3, 'SN-HON-000302', 'DISPONIBLE', 10.00, 'Unidad seminueva en bodega central', TRUE);

-- 7. RESERVA (Asociada a cliente y usuario creador)
INSERT INTO equiprent.reserva (cliente_id, usuario_creador_id, codigo_reserva, fecha_inicio_programada, fecha_fin_programada, estado)
VALUES
    (1, 1, 'RES-2026-0001', '2026-09-05 09:00:00-04', '2026-09-10 17:00:00-04', 'CONFIRMADA'),
    (2, 2, 'RES-2026-0002', '2026-09-15 08:00:00-04', '2026-09-20 18:00:00-04', 'PENDIENTE');

-- 8. RESERVA_DETALLE (Resuelve la relación N:M asociando unidad física y tarifa acordada)
INSERT INTO equiprent.reserva_detalle (reserva_id, unidad_equipo_id, tarifa_id, precio_pactado)
VALUES
    (1, 2, 3, 25.00), -- Reserva 1 compromete la unidad de andamio con tarifa diaria de 25.00
    (2, 1, 1, 35.00); -- Reserva 2 compromete la unidad amoladora con tarifa de 35.00

-- 9. DEPOSITO (Garantía 1:1 con la reserva)
INSERT INTO equiprent.deposito (reserva_id, monto_recibido, monto_retenido_danos, monto_devuelto, estado)
VALUES
    (1, 150.00, 0.00, 0.00, 'CUSTODIA'),
    (2, 100.00, 0.00, 0.00, 'PENDIENTE');

-- Consultas de verificación para ejecutar en DataGrip:
SELECT * FROM equiprent.usuario;
SELECT * FROM equiprent.cliente;
SELECT * FROM equiprent.categoria_equipo;
SELECT * FROM equiprent.equipo;
SELECT * FROM equiprent.tarifa;
SELECT * FROM equiprent.unidad_equipo;
SELECT * FROM equiprent.reserva;
SELECT * FROM equiprent.reserva_detalle;
SELECT * FROM equiprent.deposito;