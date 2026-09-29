# Capítulo 01 - Java esencial

## Entidades elegidas
- **Tabla padre:** `unidad_equipo`
- **Tabla dependiente:** `mantenimiento`
- **Relación:** 1:N (Una unidad física de equipo acumula un historial de múltiples órdenes de mantenimiento).
- **FK:** `mantenimiento.unidad_equipo_id` apunta a `unidad_equipo.unidad_equipo_id`.

## Clases Java
- `com.equiprent.unidad_equipo.domain.UnidadEquipo`
- `com.equiprent.mantenimiento.domain.Mantenimiento`
- `com.equiprent.mantenimiento.domain.TipoMantenimiento` (Enum)
- `com.equiprent.mantenimiento.domain.EstadoMantenimiento` (Enum)
- `com.equiprent.unidad_equipo.domain.port.UnidadEquipoRepository` (Contrato de interfaz)
- `com.equiprent.Main` (Clase ejecutable de prueba)

## Regla implementada
- **Coherencia temporal:** La fecha estimada de salida del taller no puede ser anterior a la fecha de ingreso (`fechaEgresoEstimada >= fechaIngreso`).
- **Control de estado operativo:** Al registrar una orden de mantenimiento mediante `registrarMantenimiento()`, el estado operativo de la unidad pasa inmediatamente a `EN_MANTENIMIENTO`.
- **Integridad referencial en Java:** Una orden de mantenimiento no puede existir sin su `UnidadEquipo` asociada (validación en el constructor).
- **Valores acumulados:** La métrica de uso (horómetro o kilometraje) no puede ser un valor negativo (`>= 0`).

## Decisiones
- **¿Por qué usamos enum?** Para garantizar seguridad tipográfica en tiempo de compilación sobre los valores finitos del `CHECK` de PostgreSQL (`tipo` y `estado`), evitando que se pasen cadenas de texto inválidas.
- **¿Por qué la colección es privada?** Para proteger el encapsulamiento. Ninguna clase externa puede modificar, vaciar o alterar la lista de mantenimientos arbitrariamente; toda adición está obligada a pasar por el método de negocio `registrarMantenimiento()`.
- **¿Qué NO implementamos todavía?** Spring Boot, anotaciones `@Entity` o `@Table`, JPA, Hibernate ni persistencia activa hacia una base de datos PostgreSQL desde Java.