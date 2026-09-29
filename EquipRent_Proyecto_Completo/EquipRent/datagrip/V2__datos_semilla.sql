-- =====================================================================
-- EquipRent · V2 · Datos semilla mínimos para demostración
-- Ejecutar DESPUÉS de V1, conectado como equiprent_admin / equiprent
-- Los password_hash son de EJEMPLO (no son contraseñas reales).
-- =====================================================================
SET search_path TO equiprent, public;

BEGIN;

-- Roles (actores de la ficha, sección C)
INSERT INTO rol (codigo, nombre, descripcion) VALUES
 ('ADMINISTRADOR', 'Administrador', 'Configura catálogo, tarifas, usuarios y políticas'),
 ('OPERADOR',      'Operador',      'Registra clientes, reservas, entregas y devoluciones'),
 ('TECNICO',       'Técnico',       'Inspecciona unidades y registra daños/mantenimiento'),
 ('CLIENTE',       'Cliente',       'Consulta reservas y estado desde móvil'),
 ('SUPERVISOR',    'Supervisor',    'Autoriza excepciones y consulta indicadores');

-- Usuarios
INSERT INTO usuario (username, email, password_hash, nombre_completo) VALUES
 ('admin',     'admin@equiprent.bo',     '$2a$10$HASH.DE.EJEMPLO.admin',     'Administrador General'),
 ('operador1', 'operador1@equiprent.bo', '$2a$10$HASH.DE.EJEMPLO.operador',  'Carla Méndez'),
 ('tecnico1',  'tecnico1@equiprent.bo',  '$2a$10$HASH.DE.EJEMPLO.tecnico',   'Jorge Rojas'),
 ('supervisor','supervisor@equiprent.bo','$2a$10$HASH.DE.EJEMPLO.supervisor','Patricia Vaca'),
 ('cliente.ana','ana.torrico@correo.com','$2a$10$HASH.DE.EJEMPLO.cliente',   'Ana Torrico');

INSERT INTO usuario_rol (usuario_id, rol_id)
SELECT u.usuario_id, r.rol_id
FROM usuario u
JOIN rol r ON (u.username, r.codigo) IN (
    ('admin','ADMINISTRADOR'), ('operador1','OPERADOR'), ('tecnico1','TECNICO'),
    ('supervisor','SUPERVISOR'), ('cliente.ana','CLIENTE'));

-- Clientes
INSERT INTO cliente (usuario_id, numero_documento, nombre_completo, email, telefono, direccion) VALUES
 ((SELECT usuario_id FROM usuario WHERE username = 'cliente.ana'),
  '7845123', 'Ana Torrico', 'ana.torrico@correo.com', '+591 70000001', 'Av. Banzer 4to anillo'),
 (NULL, '6532100', 'Constructora Norte SRL', 'compras@cnorte.bo', '+591 33400000', 'Parque Industrial Mz 12'),
 (NULL, '9011223', 'Luis Pérez', NULL, '+591 76000002', NULL);

-- Categorías
INSERT INTO categoria_equipo (codigo, nombre, descripcion) VALUES
 ('HERR',  'Herramientas eléctricas', 'Taladros, amoladoras, sierras'),
 ('AUDIO', 'Audiovisual',             'Proyectores, parlantes, cámaras'),
 ('MAQ',   'Maquinaria ligera',       'Generadores, compactadoras, mezcladoras');

-- Equipos (entidad padre)
INSERT INTO equipo (categoria_id, codigo, nombre, marca, modelo, descripcion) VALUES
 ((SELECT categoria_id FROM categoria_equipo WHERE codigo='HERR'),  'EQ-TAL-001', 'Taladro percutor 800W', 'Bosch',   'GSB 13 RE', 'Incluye maletín y brocas'),
 ((SELECT categoria_id FROM categoria_equipo WHERE codigo='AUDIO'), 'EQ-PRO-001', 'Proyector 4000 lúmenes', 'Epson',  'PowerLite X49', NULL),
 ((SELECT categoria_id FROM categoria_equipo WHERE codigo='MAQ'),   'EQ-GEN-001', 'Generador 5 kVA',        'Honda',  'EG5000', 'Motor a gasolina'),
 ((SELECT categoria_id FROM categoria_equipo WHERE codigo='MAQ'),   'EQ-MEZ-001', 'Mezcladora de concreto', 'Menegotti', 'MB-150', NULL);

-- Unidades físicas (entidad dependiente)
INSERT INTO unidad_equipo (equipo_id, codigo_unidad, numero_serie, estado, fecha_adquisicion, valor_referencial) VALUES
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-TAL-001'), 'UN-TAL-001-01', 'BSH-2024-0001', 'DISPONIBLE',    '2024-02-10',  950.00),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-TAL-001'), 'UN-TAL-001-02', 'BSH-2024-0002', 'DISPONIBLE',    '2024-02-10',  950.00),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-PRO-001'), 'UN-PRO-001-01', 'EPS-X49-7781',  'DISPONIBLE',    '2023-11-05', 4800.00),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-GEN-001'), 'UN-GEN-001-01', 'HND-EG-55120',  'DISPONIBLE',    '2022-06-20', 9800.00),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-GEN-001'), 'UN-GEN-001-02', 'HND-EG-55121',  'MANTENIMIENTO', '2022-06-20', 9800.00);

-- Historial de alta de cada unidad (RN-10)
INSERT INTO historial_estado_unidad (unidad_id, estado_anterior, estado_nuevo, motivo, cambiado_por)
SELECT unidad_id, NULL, estado, 'Alta inicial (semilla)',
       (SELECT usuario_id FROM usuario WHERE username='admin')
FROM unidad_equipo;

-- Tarifas
INSERT INTO tarifa (equipo_id, nombre, unidad_cobro, monto, deposito_sugerido, vigente_desde) VALUES
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-TAL-001'), 'Taladro por día',    'DIA',   60.00,  300.00, '2026-01-01'),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-PRO-001'), 'Proyector por día',  'DIA',  150.00, 1000.00, '2026-01-01'),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-GEN-001'), 'Generador por día',  'DIA',  250.00, 2000.00, '2026-01-01'),
 ((SELECT equipo_id FROM equipo WHERE codigo='EQ-GEN-001'), 'Generador semanal',  'SEMANA',1400.00, 2000.00, '2026-01-01');

-- Una reserva confirmada de ejemplo (flujo crítico)
INSERT INTO reserva (codigo, cliente_id, fecha_inicio, fecha_fin, estado, created_by) VALUES
 ('RES-2026-0001',
  (SELECT cliente_id FROM cliente WHERE numero_documento='7845123'),
  '2026-10-01 08:00-04', '2026-10-03 18:00-04', 'CONFIRMADA',
  (SELECT usuario_id FROM usuario WHERE username='operador1'));

INSERT INTO reserva_detalle (reserva_id, unidad_id, tarifa_id, precio_aplicado) VALUES
 ((SELECT reserva_id FROM reserva WHERE codigo='RES-2026-0001'),
  (SELECT unidad_id FROM unidad_equipo WHERE codigo_unidad='UN-PRO-001-01'),
  (SELECT tarifa_id FROM tarifa WHERE nombre='Proyector por día'),
  150.00);

INSERT INTO deposito (reserva_id, monto, metodo, referencia, registrado_por) VALUES
 ((SELECT reserva_id FROM reserva WHERE codigo='RES-2026-0001'), 1000.00, 'QR', 'QR-000123',
  (SELECT usuario_id FROM usuario WHERE username='operador1'));

INSERT INTO auditoria (usuario_id, entidad, entidad_id, accion, detalle) VALUES
 ((SELECT usuario_id FROM usuario WHERE username='operador1'), 'reserva',
  (SELECT reserva_id FROM reserva WHERE codigo='RES-2026-0001'), 'CONFIRMAR',
  '{"origen":"semilla"}');

COMMIT;

-- Resumen
SELECT 'equipo' AS tabla, COUNT(*) FROM equipo
UNION ALL SELECT 'unidad_equipo', COUNT(*) FROM unidad_equipo
UNION ALL SELECT 'cliente', COUNT(*) FROM cliente
UNION ALL SELECT 'reserva', COUNT(*) FROM reserva;
