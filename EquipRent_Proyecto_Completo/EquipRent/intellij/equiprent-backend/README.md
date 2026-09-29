# equiprent-backend (Capítulos 03 al 07)

Spring Boot 3.5 · Java 21 · Maven · PostgreSQL · Arquitectura hexagonal · Monolito modular

## Par 1:N
| Dato | EquipRent |
|---|---|
| Package base | `com.equiprent` |
| Entidad padre | `Equipo` → tabla `equipo`, PK `equipo_id`, módulo `equipment` |
| Entidad dependiente | `UnidadEquipo` → tabla `unidad_equipo`, PK `unidad_id`, módulo `unit` |
| FK | `unidad_equipo.equipo_id` (constraint `fk_unidad_equipo_equipo`) |
| UNIQUE | `equipo.codigo`, `unidad_equipo.codigo_unidad`, `unidad_equipo.numero_serie` |
| CHECK / enum | `unidad_equipo.estado` → `EstadoUnidad` |
| Base / schema | `equiprent` / `equiprent` |

## Cómo ejecutarlo
1. En DataGrip ejecuta `datagrip/00`, luego `V1` y `V2` (conexión equiprent_admin → equiprent).
2. IntelliJ: File > Open > `equiprent-backend` (Maven). SDK Java 21.
3. Si cambiaste la contraseña, crea variables de entorno en Run Configuration:
   `DB_USERNAME=equiprent_admin; DB_PASSWORD=tu_clave`
4. Ejecuta `EquipRentApplication`. Hibernate valida el esquema (`ddl-auto: validate`).
5. Abre `requests.http` y ejecuta las peticiones en orden.
6. Pruebas unitarias: `UnidadEquipoServiceTest` (no necesita base de datos).

> Si IntelliJ crea el proyecto con otra versión de Spring Boot en tu clase, sólo cambia `<version>` del parent en `pom.xml`.

## Estructura
```
com.equiprent
├── EquipRentApplication.java
├── shared
│   ├── application/ProjectInfoService            (Cap. 03 Bean)
│   ├── domain/exception/ (bases 404 / 409 / 422)
│   └── web/ HealthController, ApiErrorResponse, GlobalExceptionHandler
├── equipment                                     (PADRE)
│   ├── domain
│   │   ├── model/Equipo
│   │   ├── exception/ EquipoNoEncontrado, EquipoDuplicado, CategoriaNoEncontrada, EquipoInactivo
│   │   └── port
│   │       ├── in/  RegistrarEquipoUseCase, ConsultarEquipoUseCase
│   │       └── out/ EquipoRepositoryPort
│   ├── application
│   │   ├── EquipoDemoService                     (Cap. 03)
│   │   └── service/EquipoService
│   └── infrastructure/adapter
│       ├── in/web/  EquipoController, EquipoDemoController, dto/, mapper/
│       └── out/persistence/ EquipoPersistenceAdapter, entity/, mapper/, repository/
└── unit                                          (DEPENDIENTE)
    ├── domain/model/ UnidadEquipo, EstadoUnidad
    ├── domain/exception/ ...
    ├── domain/port/in, out
    ├── application/service/UnidadEquipoService
    └── infrastructure/adapter/in/web, out/persistence (@ManyToOne)
```

## Recorrido por capítulo
| Capítulo | Qué quedó implementado |
|---|---|
| 03 | `/api/health`, `ProjectInfoService` inyectado por constructor, `GET /api/equipos/demo` |
| 04 | `CrearEquipoRequest` / `EquipoResponse` (records), `@Valid`, `@PathVariable`, `@RequestParam`, 201/200/400/404 |
| 05 | `application.yml` con validate, `EquipoJpaEntity`, `SpringDataEquipoRepository`, mapper de persistencia |
| 06 | Port IN / Port OUT, `EquipoService` implementa los casos de uso, `EquipoPersistenceAdapter`, controller depende de Ports IN |
| 07 | Módulo `unit` hexagonal, `@ManyToOne` + `@JoinColumn(equipo_id)`, validación del padre vía `ConsultarEquipoUseCase`, `findByEquipo_Id` |
| (08 adelanto) | `GlobalExceptionHandler` con 400/404/409/422 y `@Transactional` |

> En el Cap. 04 el servicio usaba una lista en memoria; desde el Cap. 05-06 esa lista fue reemplazada por PostgreSQL, como indica la guía.

## Contrato HTTP
| Verbo | Ruta | Entrada | Salida | Status |
|---|---|---|---|---|
| GET | /api/health | — | JSON estado | 200 |
| GET | /api/equipos/demo | — | EquipoDemoResponse | 200 |
| POST | /api/equipos | CrearEquipoRequest | EquipoResponse | 201 / 400 / 409 / 422 |
| GET | /api/equipos?nombre= | query opcional | List<EquipoResponse> | 200 |
| GET | /api/equipos/{id} | path variable | EquipoResponse | 200 / 404 |
| POST | /api/unidades | CrearUnidadEquipoRequest | UnidadEquipoResponse | 201 / 400 / 404 / 409 / 422 |
| GET | /api/unidades/{id} | path variable | UnidadEquipoResponse | 200 / 404 |
| GET | /api/unidades/equipo/{equipoId} | path variable | List<UnidadEquipoResponse> | 200 / 404 |

## Recorrido POST /api/unidades → PostgreSQL
1. `UnidadEquipoController` recibe JSON y `@Valid` revisa formato (400 si falla).
2. `UnidadEquipoWebMapper` crea el dominio `UnidadEquipo` (normaliza código a mayúsculas).
3. `RegistrarUnidadEquipoUseCase` → `UnidadEquipoService` (`@Transactional`).
4. Pregunta al módulo padre con `ConsultarEquipoUseCase` (404 si no existe, 422 si está inactivo).
5. Verifica estado de alta (422) y UNIQUE de código/serie con el Port OUT (409).
6. `UnidadEquipoPersistenceAdapter` obtiene `getReferenceById(equipoId)` y guarda la `UnidadEquipoJpaEntity`.
7. Hibernate ejecuta `INSERT INTO equiprent.unidad_equipo (...)`; la FK física vuelve a proteger el dato.
8. Se devuelve `201 Created` con `Location` y el JSON.

## Respuestas de defensa rápidas
- **¿Por qué el dominio no tiene @Entity?** Para que las reglas no dependan de JPA; si cambia la persistencia sólo cambia `infrastructure`.
- **¿Qué clase conoce el nombre de la tabla?** Sólo `EquipoJpaEntity` y `UnidadEquipoJpaEntity`.
- **¿Por qué @ManyToOne y no @OneToMany?** La FK vive en `unidad_equipo`; muchas unidades apuntan a un equipo. No se necesita navegar desde el equipo a toda la colección.
- **¿Qué significa LAZY?** El equipo no se carga con SELECT hasta que se usa; para leer su id basta el proxy.
- **¿Por qué validate?** El esquema lo define el DDL del grupo; Java se adapta, no al revés.
- **¿Qué pasa si llega una FK inexistente a la base?** PostgreSQL la rechaza (`fk_unidad_equipo_equipo`) y el handler responde 409; igual el servicio ya lo detecta antes con 404.
- **Diferencia Equipo / UnidadEquipo:** el equipo es el modelo del catálogo; la unidad es la copia física con código propio que se entrega, inspecciona y bloquea.

## Commits sugeridos
```
git commit -m "feat: bootstrap Spring Boot backend and first REST endpoints"
git commit -m "feat: add REST API and validation for equipo"
git commit -m "feat: conectar backend con PostgreSQL y mapear entidad principal con JPA"
git commit -m "feat: aplicar arquitectura hexagonal a equipo"
git commit -m "feat: implement unit relation with equipment"
```
