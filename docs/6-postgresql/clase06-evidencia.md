# Evidencia Clase 06 — EquipRent

> Actualizada en la Fase 2 (2026-10-20) para que coincida con el esquema real. La versión anterior describía un diseño preliminar (PK `id`, `codigo_inventario`, `tarifa_dia`) que nunca se implementó.

## Dónde está el DDL

| Archivo | Contenido |
|---|---|
| `docs/equiprent-backend/src/main/resources/db/migration/V1__init_core.sql` | Esquema `equiprent`: 15 tablas con PK, FK, UNIQUE e índices |
| `docs/equiprent-backend/src/main/resources/db/migration/V3__normalizar_estados_y_checks.sql` | CHECK de dominio y de fechas sobre `unidad_equipo` y `mantenimiento` |
| `docs/6-postgresql/clase06-pruebas-integridad.sql` | 7 violaciones provocadas a propósito |

Base de datos: `equiprent` (PostgreSQL, UTF-8), esquema `equiprent`. Las migraciones las aplica Flyway al arrancar Spring Boot.

## Tablas núcleo del flujo crítico y orden de creación

1. `categoria_equipo` (sin FK)
2. `equipo` (FK → `categoria_equipo`)
3. `unidad_equipo` (FK → `equipo`)
4. `dano` (FK → `unidad_equipo`, entre otras)
5. `mantenimiento` (FK → `unidad_equipo`, FK opcional → `dano`)

La relación principal del proyecto es **`unidad_equipo` 1:N `mantenimiento`**: una unidad física acumula muchas órdenes de taller; cada orden pertenece a exactamente una unidad.

## PK, FK, UNIQUE y CHECK de la relación principal

| Tabla | Constraint | Tipo | Regla que protege |
|---|---|---|---|
| `unidad_equipo` | `unidad_equipo_id` | PK (IDENTITY) | Identificador técnico estable |
| `unidad_equipo` | `fk_unidad_equipo_equipo` | FK `ON DELETE RESTRICT` | Toda unidad pertenece a un modelo de catálogo |
| `unidad_equipo` | `uq_unidad_equipo_numero_serie` | UNIQUE | Una serie física no se registra dos veces (RN-01) |
| `unidad_equipo` | `ck_unidad_equipo_estado_operativo` | CHECK | `DISPONIBLE, RESERVADA, EN_USO, EN_MANTENIMIENTO, DE_BAJA` |
| `unidad_equipo` | `ck_unidad_equipo_metrica_uso` | CHECK | La métrica de uso no puede ser negativa |
| `mantenimiento` | `mantenimiento_id` | PK (IDENTITY) | Identificador de la orden |
| `mantenimiento` | `fk_mantenimiento_unidad_equipo` | FK NOT NULL `ON DELETE RESTRICT` | No hay orden sin unidad; no se borra una unidad con historial |
| `mantenimiento` | `fk_mantenimiento_dano` + `uq_mantenimiento_dano_id` | FK opcional + UNIQUE | Un daño origina como máximo una orden correctiva (RN-07) |
| `mantenimiento` | `ck_mantenimiento_tipo` | CHECK | `PREVENTIVO, CORRECTIVO` |
| `mantenimiento` | `ck_mantenimiento_estado` | CHECK | `EN_PROCESO, COMPLETADO, CANCELADO` |
| `mantenimiento` | `ck_mantenimiento_fechas` | CHECK | Egreso estimado y real no pueden ser anteriores al ingreso |

## Errores de integridad probados

Resultados obtenidos al ejecutar `clase06-pruebas-integridad.sql` sobre una base limpia con V1–V4 (PostgreSQL 16). Repetir en DataGrip y adjuntar la captura de cada error.

| # | Prueba | Mensaje de PostgreSQL |
|---|---|---|
| 1 | UNIQUE: serie `SN-MAK-000124` repetida | `duplicate key value violates unique constraint "uq_unidad_equipo_numero_serie"` |
| 2 | FK: `equipo_id = 999` inexistente | `insert or update on table "unidad_equipo" violates foreign key constraint "fk_unidad_equipo_equipo"` |
| 3 | CHECK: estado `ALQUILADO` | `new row for relation "unidad_equipo" violates check constraint "ck_unidad_equipo_estado_operativo"` |
| 4 | CHECK: tipo `INSPECCION` | `new row for relation "mantenimiento" violates check constraint "ck_mantenimiento_tipo"` |
| 5 | CHECK: egreso antes del ingreso | `new row for relation "mantenimiento" violates check constraint "ck_mantenimiento_fechas"` |
| 6 | RESTRICT: borrar unidad con órdenes | `update or delete on table "unidad_equipo" violates foreign key constraint "fk_mantenimiento_unidad_equipo" on table "mantenimiento"` |
| 7 | NOT NULL: orden sin unidad | `null value in column "unidad_equipo_id" of relation "mantenimiento" violates not-null constraint` |

La prueba 6 es la que el backend traduce a **HTTP 409 Conflict** cuando el frontend intenta eliminar una unidad con historial de taller.
