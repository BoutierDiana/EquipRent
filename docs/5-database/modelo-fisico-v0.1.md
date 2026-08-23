# Modelo físico v0.1 — EquipRent

Núcleo del primer flujo crítico: un cliente reserva una unidad física de un equipo perteneciente a una
categoría. Este V1 cubre catálogo (categoría → equipo → unidad) + actor (cliente) + transacción raíz (reserva).

## categoria_equipo
Propósito: agrupa equipos por tipo (ej. herramientas eléctricas, andamios, generadores).

| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| id | BIGINT IDENTITY | NO | PK | Diseño |
| codigo | VARCHAR(20) | NO | UNIQUE | RN-01 |
| nombre | VARCHAR(100) | NO | — | RF-01 |
| descripcion | TEXT | SÍ | — | RF-01 |

### Decisiones
- `codigo` es clave natural del catálogo; se conserva como UNIQUE, no como PK.

## equipo
Propósito: representa un modelo/tipo de equipo alquilable (no la unidad física individual).

| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| id | BIGINT IDENTITY | NO | PK | Diseño |
| categoria_equipo_id | BIGINT | NO | FK -> categoria_equipo.id | RN-02 |
| codigo_modelo | VARCHAR(30) | NO | UNIQUE | RN-02 |
| nombre | VARCHAR(120) | NO | — | RF-02 |
| marca | VARCHAR(60) | SÍ | — | RF-02 |
| tarifa_dia | NUMERIC(10,2) | NO | CHECK > 0 | RN-03 |

### Decisiones
- `tarifa_dia` es dinero: se usa NUMERIC(10,2), nunca FLOAT.
- La FK a `categoria_equipo` es obligatoria: un equipo no existe sin categoría en la ficha del proyecto.

## unidad_equipo
Propósito: instancia física individual de un equipo, la que realmente se entrega/reserva.

| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| id | BIGINT IDENTITY | NO | PK | Diseño |
| equipo_id | BIGINT | NO | FK -> equipo.id | RN-02 |
| codigo_inventario | VARCHAR(30) | NO | UNIQUE | RN-04 |
| estado | VARCHAR(20) | NO | CHECK IN (DISPONIBLE, RESERVADA, ALQUILADA, EN_MANTENIMIENTO, DE_BAJA) | RN-05 |
| fecha_adquisicion | DATE | SÍ | — | RF-03 |

### Decisiones
- `codigo_inventario` es la clave natural de negocio para localizar físicamente una unidad; UNIQUE global.
- `estado` es un conjunto cerrado; se protege con CHECK y se sabe que las transiciones (ej. no reservar una
  unidad `EN_MANTENIMIENTO`) requieren lógica transaccional adicional, no solo el CHECK.

## cliente
Propósito: persona o empresa que alquila equipos.

| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| id | BIGINT IDENTITY | NO | PK | Diseño |
| nombre_completo | VARCHAR(150) | NO | — | RF-04 |
| documento_identidad | VARCHAR(20) | NO | UNIQUE | RN-06 |
| telefono | VARCHAR(20) | SÍ | — | RF-04 |
| email | VARCHAR(120) | SÍ | UNIQUE | RN-06 |

### Decisiones
- `documento_identidad` es clave natural obligatoria; `email` es único pero opcional (no todo cliente
  registra correo en el mostrador).

## reserva
Propósito: compromiso de disponibilidad de una unidad de equipo para un cliente en un intervalo de fechas.

| Columna | Tipo candidato | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| id | BIGINT IDENTITY | NO | PK | Diseño |
| cliente_id | BIGINT | NO | FK -> cliente.id | RN-07 |
| unidad_equipo_id | BIGINT | NO | FK -> unidad_equipo.id | RN-07 |
| fecha_inicio | TIMESTAMPTZ | NO | — | RF-05 |
| fecha_fin | TIMESTAMPTZ | NO | CHECK fecha_fin > fecha_inicio | RN-08 |
| estado | VARCHAR(20) | NO | CHECK IN (PENDIENTE, CONFIRMADA, CANCELADA, COMPLETADA) DEFAULT 'PENDIENTE' | RN-09 |
| deposito | NUMERIC(10,2) | NO | CHECK >= 0 DEFAULT 0 | RN-10 |
| created_at | TIMESTAMPTZ | NO | DEFAULT CURRENT_TIMESTAMP | Diseño |

### Decisiones
- `deposito` es dinero: NUMERIC(10,2), no FLOAT.
- La regla "una misma unidad no puede tener dos reservas CONFIRMADA con fechas solapadas" **no** se resuelve
  con un CHECK de una sola fila: requiere validar contra otras filas. Queda documentada como regla
  transaccional pendiente de lógica de backend.

## Regla que NO se resuelve sólo con constraint simple
- Evitar solapamiento de reservas para la misma `unidad_equipo_id` (RN-11): depende de comparar múltiples
  filas; se resolverá en la capa de servicio (y opcionalmente con un `EXCLUDE` de PostgreSQL más adelante).
- Impedir reservar una unidad en estado `EN_MANTENIMIENTO` o `DE_BAJA` (RN-05): depende del estado actual de
  otra fila al momento de la inserción; se resolverá en backend.
