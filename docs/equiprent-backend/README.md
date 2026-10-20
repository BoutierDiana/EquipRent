# EquipRent — Backend (Spring Boot)

API REST de EquipRent para la relación principal **UnidadEquipo 1:N Mantenimiento**.
Java 21 · Spring Boot 3.2.5 · PostgreSQL · Flyway · arquitectura hexagonal.

## Requisitos y arranque

1. PostgreSQL con la base `equiprent` y el usuario `equiprent_admin` (puerto local 5433 por defecto).
2. Desde esta carpeta:

```bash
./mvnw spring-boot:run      # Windows: mvnw.cmd spring-boot:run
./mvnw test                 # tests unitarios y de capa web
```

Al arrancar, Flyway aplica las migraciones de `src/main/resources/db/migration`.
- Base vacía: ejecuta V1 a V4.
- Base con V1 y V2 ya aplicados a mano: registra la línea base en la versión 2 y ejecuta solo V3 y V4 (ver ADR-002 en `docs/03-decisions`).

Variables de entorno opcionales (tienen valores por defecto para desarrollo):

| Variable | Uso | Valor por defecto |
|---|---|---|
| `DB_URL` | JDBC de PostgreSQL | `jdbc:postgresql://localhost:5433/equiprent` |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales | `equiprent_admin` / valor local |
| `CORS_ALLOWED_ORIGINS` | Orígenes del frontend, separados por coma | `http://localhost:5173,http://localhost:4173` |

Contrato observable: **Swagger UI** en `http://localhost:8080/swagger-ui.html`. Pruebas manuales: `requests.http`.

## Endpoints

| Método | Ruta | Éxito | Errores |
|---|---|---|---|
| GET | `/api/unidades-equipo?estado=` | 200 | — |
| GET | `/api/unidades-equipo/{id}` | 200 | 400 id no numérico, 404 |
| POST | `/api/unidades-equipo` | 201 | 400 validación, 409 serie duplicada |
| PUT | `/api/unidades-equipo/{id}` | 200 | 400, 404, 409 serie de otra unidad |
| DELETE | `/api/unidades-equipo/{id}` | 204 | 404, **409 si tiene mantenimientos** |
| GET | `/api/mantenimientos` | 200 | — |
| GET | `/api/mantenimientos/{id}` | 200 | 404 |
| GET | `/api/mantenimientos/unidad-equipo/{unidadEquipoId}` | 200 | — |
| POST | `/api/mantenimientos` | 201 | 400 validación o fechas, 404 unidad inexistente |
| PUT | `/api/mantenimientos/{id}` | 200 | 400, 404 orden o unidad (permite cambiar de unidad) |
| DELETE | `/api/mantenimientos/{id}` | 204 | 404 |
| GET | `/api/health` | 200 | — |

Todos los errores devuelven el mismo cuerpo `ApiError`:

```json
{
  "timestamp": "2026-10-20T12:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Error de validación en los campos enviados",
  "path": "/api/unidades-equipo",
  "fieldErrors": { "estadoOperativo": "El estado operativo debe ser DISPONIBLE, RESERVADA, EN_USO, EN_MANTENIMIENTO o DE_BAJA" }
}
```

## Catálogos (ADR-001)

| Campo | Valores |
|---|---|
| `estadoOperativo` | `DISPONIBLE`, `RESERVADA`, `EN_USO`, `EN_MANTENIMIENTO`, `DE_BAJA` |
| `tipo` | `PREVENTIVO`, `CORRECTIVO` |
| `estado` (mantenimiento) | `EN_PROCESO`, `COMPLETADO`, `CANCELADO` |

## Estructura (hexagonal)

```
com.equiprent
├── unidadequipo / mantenimiento
│   ├── domain            modelo, excepciones y puertos (in = casos de uso, out = repositorio)
│   ├── application       servicios que implementan los casos de uso
│   └── infrastructure
│       ├── adapter/in/web       controller, DTO (record + Bean Validation), mapper web
│       └── adapter/out/persistence  entidad JPA, Spring Data, mapper y adaptador
└── shared
    ├── config            CorsConfig (única política CORS)
    ├── domain/exception  bases 404 / 409 / 400 de las excepciones de negocio
    └── web               ApiError, GlobalExceptionHandler, HealthController
```

Recorrido de un POST: Controller (`@Valid`) → mapper web → caso de uso (Service) → puerto out → adaptador JPA (`saveAndFlush`) → PostgreSQL → entidad → dominio → `Response` JSON.

## Tests

| Clase | Qué prueba |
|---|---|
| `UnidadEquipoServiceTest` | Serie duplicada, filtro por estado, PUT conserva id y `createdAt`, 404, 409 por dependencias |
| `MantenimientoServiceTest` | Unidad inexistente, fechas incoherentes, reasignación de unidad, 404 |
| `UnidadEquipoControllerTest` | 201, 400 con `fieldErrors`, 409, 404 con `ApiError`, id no numérico, DELETE 204/409 |
| `MantenimientoControllerTest` | Listado, 404, catálogo inválido, fecha mal formada, unidad inexistente, fechas |
| `EquiprentBackendApplicationTests` | Arranque completo; **necesita la base PostgreSQL encendida** |
