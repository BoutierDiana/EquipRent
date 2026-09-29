# Modelo físico v0.1 — EquipRent (Clase 05)

Estrategia de IDs: BIGINT IDENTITY (simple, compatible con JPA IDENTITY). Claves naturales como UNIQUE porque pueden corregirse (una etiqueta física se reimprime).

## equipo
Propósito: tipo/modelo del catálogo.
| Columna | Tipo | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| equipo_id | BIGINT IDENTITY | NO | PK | Diseño |
| categoria_id | BIGINT | NO | FK → categoria_equipo | RF-01 |
| codigo | VARCHAR(30) | NO | UQ, CK no vacío | RF-01 |
| nombre | VARCHAR(120) | NO | — | RF-01 |
| marca | VARCHAR(60) | SÍ | — | RF-01 |
| modelo | VARCHAR(60) | SÍ | — | RF-01 |
| descripcion | TEXT | SÍ | — | RF-01 |
| activo | BOOLEAN | NO | DEFAULT TRUE | RF-01 |
| created_at | TIMESTAMPTZ | NO | DEFAULT now() | Auditoría |
| updated_at | TIMESTAMPTZ | NO | DEFAULT now() | Auditoría |

## unidad_equipo
Propósito: unidad física entregable.
| Columna | Tipo | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| unidad_id | BIGINT IDENTITY | NO | PK | Diseño |
| equipo_id | BIGINT | NO | FK → equipo | RN-01 |
| codigo_unidad | VARCHAR(40) | NO | UQ | RN-01 |
| numero_serie | VARCHAR(80) | SÍ | UQ | RF-02 |
| estado | VARCHAR(20) | NO | CK dominio, DEFAULT DISPONIBLE | RN-01, RN-07 |
| fecha_adquisicion | DATE | SÍ | — | RF-15 |
| valor_referencial | NUMERIC(12,2) | SÍ | CK ≥ 0 | RF-13 |
| observacion | TEXT | SÍ | — | RF-02 |
| created_at / updated_at | TIMESTAMPTZ | NO | DEFAULT now() | Auditoría |

### Decisiones
- NUMERIC(12,2): valor máximo razonable 9.999.999.999,99 Bs con 2 decimales.
- fecha_adquisicion es DATE: sólo importa el día.

### Regla que NO se resuelve sólo con constraint simple
- RN-02 (solapamiento de reservas por unidad) y RN-07 (daño que bloquea la unidad).

## reserva
| Columna | Tipo | NULL | Rol/Restricción | Fuente |
|---|---|---|---|---|
| reserva_id | BIGINT IDENTITY | NO | PK | Diseño |
| codigo | VARCHAR(30) | NO | UQ | RF-16 |
| cliente_id | BIGINT | NO | FK → cliente | RF-06 |
| fecha_inicio | TIMESTAMPTZ | NO | — | RN-03 |
| fecha_fin | TIMESTAMPTZ | NO | CK fin > inicio | RN-03 |
| estado | VARCHAR(20) | NO | CK dominio | RF-08 |
| motivo_cancelacion | TEXT | SÍ | CK si CANCELADA | RN-09 |
| created_by | BIGINT | SÍ | FK → usuario | RF-18 |

Las 18 tablas completas están en `datagrip/V1__creacion_completa_equiprent.sql`.
