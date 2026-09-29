# Capítulos 01 y 02 - Java 21 · EquipRent

Proyecto: **equiprent-backend-lab** · Package base: `com.equiprent`

## Entidades elegidas
- Tabla padre: `equipo` (PK `equipo_id`) -> módulo `equipment`
- Tabla dependiente: `unidad_equipo` (PK `unidad_id`) -> módulo `unit`
- Relación: 1:N (un equipo del catálogo tiene muchas unidades físicas; cada unidad pertenece a un equipo)
- FK: `unidad_equipo.equipo_id -> equipo.equipo_id`
- UNIQUE: `equipo.codigo`, `unidad_equipo.codigo_unidad` (RN-01)
- Estado: `unidad_equipo.estado` (CHECK) -> `enum EstadoUnidad`

## Cómo ejecutarlo en IntelliJ
1. File > Open > carpeta `equiprent-backend-lab` (IntelliJ lo detecta como Maven).
2. Project Structure > SDK = Java 21.
3. Ejecuta `com.equiprent.Main`.

## Capítulo 01 (Java esencial)
- `Equipo` y `UnidadEquipo` con atributos `private` y constructores que validan.
- Relación 1:N: `List<UnidadEquipo>` privada dentro de `Equipo` + `agregarUnidad()`.
- Regla: la unidad debe pertenecer al equipo y su código no puede repetirse.
- Enum `EstadoUnidad` sale del CHECK real de la tabla.
- `EquipoResumen` es un record inmutable.

## Capítulo 02 (contratos, colecciones y errores)
### Colección elegida
Usamos `Map<Long, Equipo>` porque la búsqueda principal es por id (como la PK). `LinkedHashMap` mantiene el orden para listar.
### Optional
`buscarPorId` puede no encontrar el equipo; `Optional` lo hace visible y el servicio lo convierte en `EquipoNoEncontradoException`.
### Excepciones propias
- `EquipoNoEncontradoException`: id inexistente.
- `CodigoEquipoDuplicadoException`: se viola el UNIQUE lógico de `codigo`.
- `CodigoUnidadRepetidoEnEquipoException`: unidad repetida dentro del equipo.
- `TransicionEstadoInvalidaException`: cambio de estado incoherente.
### Enum
`EstadoUnidad` evita guardar textos libres como "perdida" o "ok".
### Record
`RegistrarUnidadEquipoCommand` lleva sólo los datos de la operación de alta (sin id ni estado).
### ¿Qué cambiará con PostgreSQL?
Sólo `EquipoRepositoryEnMemoria` se reemplaza por un adaptador JPA. `EquipoService` no cambia porque depende de la interfaz.

## Salida esperada (resumen)
```
Equipos registrados: 2
ERROR CONTROLADO (obtener id inexistente): EquipoNoEncontradoException -> No existe el equipo con id: 999
ERROR CONTROLADO (código de equipo duplicado): CodigoEquipoDuplicadoException -> ...
```

## Commits sugeridos
```
git commit -m "feat: crear modelo Java inicial del dominio"
git commit -m "feat(java): aplicar interfaces colecciones optional y excepciones al dominio"
```
