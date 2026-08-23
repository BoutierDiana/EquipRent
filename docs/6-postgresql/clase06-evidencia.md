# Evidencia Clase 06 — EquipRent

## Base de datos creada
`equiprent` (PostgreSQL, ENCODING UTF8, OWNER postgres).

## Tablas incluidas en V1 y por qué fueron seleccionadas
- `categoria_equipo`, `equipo`, `unidad_equipo`: forman la cadena de catálogo necesaria para saber
  qué se puede alquilar y en qué unidad física concreta.
- `cliente`: actor imprescindible para cualquier reserva.
- `reserva`: es la tabla transaccional que conecta cliente con unidad_equipo; es el corazón del flujo crítico.

## Orden de creación
1. `categoria_equipo` (sin FK)
2. `equipo` (FK → categoria_equipo)
3. `unidad_equipo` (FK → equipo)
4. `cliente` (sin FK)
5. `reserva` (FK → cliente, FK → unidad_equipo)

## PK y FK
- PK: `id` en las cinco tablas.
- FK: `equipo.categoria_equipo_id → categoria_equipo.id`,
  `unidad_equipo.equipo_id → equipo.id`,
  `reserva.cliente_id → cliente.id`,
  `reserva.unidad_equipo_id → unidad_equipo.id`.

## UNIQUE y CHECK implementados
- UNIQUE: `categoria_equipo.codigo`, `equipo.codigo_modelo`, `unidad_equipo.codigo_inventario`,
  `cliente.documento_identidad`, `cliente.email`.
- CHECK: `equipo.tarifa_dia > 0`, `unidad_equipo.estado` en dominio cerrado,
  `reserva.fecha_fin > fecha_inicio`, `reserva.estado` en dominio cerrado, `reserva.deposito >= 0`.

## Errores de integridad probados
1. **NOT NULL**: intentar insertar un `cliente` sin `nombre_completo` fue rechazado por PostgreSQL
   (`null value in column "nombre_completo" violates not-null constraint`).
2. **UNIQUE**: intentar insertar una segunda `categoria_equipo` con `codigo = 'CAT-01'` fue rechazado
   (`duplicate key value violates unique constraint "uq_categoria_equipo_codigo"`).
3. **FOREIGN KEY**: intentar insertar un `equipo` con `categoria_equipo_id = 999` (inexistente) fue
   rechazado (`insert or update on table "equipo" violates foreign key constraint "fk_equipo_categoria"`).
4. **CHECK**: intentar insertar una `unidad_equipo` con `estado = 'ESTADO_INVALIDO'` fue rechazado
   (`new row for relation "unidad_equipo" violates check constraint "ck_unidad_equipo_estado"`).

## Decisiones pendientes para la siguiente clase
- Diseñar el dataset de prueba ampliado (2–5 filas por tabla) para poder practicar filtros reales.
- Definir qué preguntas de negocio se responderán con las primeras consultas SELECT.
- Evaluar si conviene un índice sobre `reserva.unidad_equipo_id` una vez existan más consultas.
