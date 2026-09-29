# Capítulo 02 - Java 21: Arquitectura y Modelado de Dominio

## Entidad padre
`UnidadEquipo`: Representa la maquinaria física disponible para alquiler. Posee como clave primaria (`PK`) su atributo `id` y como clave candidata `UNIQUE` el atributo `numeroSerie`.

## Entidad dependiente
`Mantenimiento`: Representa las órdenes de servicio técnico y reparación asociadas a una máquina.

## Relación
**1:N (Uno a Muchos):** Una `UnidadEquipo` puede acumular múltiples órdenes de `Mantenimiento`, mientras que cada registro de `Mantenimiento` pertenece estrictamente a una única `UnidadEquipo` (referenciada mediante su clave foránea `unidadEquipoId`).

## Colección elegida
Usamos **`Map<Long, UnidadEquipo>`** (`HashMap`) porque permite asociar directamente una clave (`id`) con su objeto correspondiente, garantizando búsquedas en tiempo constante $O(1)$ y simulando con precisión el comportamiento de un índice de clave primaria (`PRIMARY KEY`).

## Optional
El método `buscarPorId(Long id)` devuelve un **`Optional<UnidadEquipo>`** porque una búsqueda por ID puede encontrar o no el registro. `Optional` elimina el uso de referencias `null` y obliga al consumidor del servicio a gestionar el caso con `.orElseThrow()`.

## Excepciones propias
* **`UnidadNoEncontradaException`**: Se dispara cuando no existe la unidad consultada por `id`.
* **`NumeroSerieDuplicadoException`**: Se dispara para proteger la regla de unicidad (`UNIQUE`) si se intenta registrar un número de serie ya existente.

## Enum
* **`TipoMantenimiento`**: Define de manera cerrada las categorías permitidas (`PREVENTIVO`, `CORRECTIVO`).
* **`EstadoMantenimiento`**: Modela el ciclo de vida de la orden (`PENDIENTE`, `EN_PROCESO`, `COMPLETADO`).

## Record
* **`RegistrarMantenimientoCommand`**: Transporta de forma inmutable los datos necesarios para registrar un mantenimiento, garantizando que no se alteren en tránsito hacia el caso de uso.