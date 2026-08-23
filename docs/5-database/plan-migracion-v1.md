# Plan de Migración V1 — EquipRent

## Objetivo
Representar el núcleo mínimo del flujo crítico: catálogo de equipos (categoría → equipo → unidad física),
el actor cliente, y la reserva que los conecta.

## Tablas incluidas y orden
1. categoria_equipo (sin dependencias — raíz de catálogo)
2. equipo (depende de categoria_equipo)
3. unidad_equipo (depende de equipo)
4. cliente (sin dependencias — raíz de actor)
5. reserva (depende de cliente y de unidad_equipo)

## Restricciones previstas
- PK: `id` autogenerado en las 5 tablas.
- FK: `equipo.categoria_equipo_id`, `unidad_equipo.equipo_id`, `reserva.cliente_id`,
  `reserva.unidad_equipo_id`.
- NOT NULL: campos obligatorios por regla de negocio (ver `modelo-fisico-v0.1.md`).
- UNIQUE: `categoria_equipo.codigo`, `equipo.codigo_modelo`, `unidad_equipo.codigo_inventario`,
  `cliente.documento_identidad`, `cliente.email`.
- CHECK: `equipo.tarifa_dia > 0`, `unidad_equipo.estado` en dominio cerrado, `reserva.fecha_fin > fecha_inicio`,
  `reserva.estado` en dominio cerrado, `reserva.deposito >= 0`.

## Reglas que requerirán lógica posterior
- No permitir reservas solapadas para la misma unidad de equipo (RN-11).
- No permitir reservar una unidad `EN_MANTENIMIENTO` o `DE_BAJA` (RN-05).
- Transiciones válidas de `reserva.estado` (ej. no pasar de CANCELADA a CONFIRMADA).

## Fuera de V1
- Entrega y devolución física del equipo (tabla `entrega`/`devolucion`).
- Registro de daños/incidencias sobre una unidad.
- Tarifas especiales o descuentos.
- Historial de mantenimiento de una unidad.

## Criterio de salida
Podemos escribir el DDL de V1 sin tomar decisiones nuevas importantes: las 5 tablas, sus tipos, PK/FK y
restricciones ya están cerradas y documentadas arriba.
