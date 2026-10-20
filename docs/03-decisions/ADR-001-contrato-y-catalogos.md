# ADR-001 — Contrato de API y catálogos de estado

Fecha: 2026-10-20 · Estado: aceptada

## 1. Contexto
Al auditar el repositorio (Fase 1) se encontraron tres versiones distintas de las mismas entidades:
- La base de datos (`V1__init_core.sql`) y el backend Spring Boot (`docs/equiprent-backend`) usan `numero_serie`, `estado_operativo`, `metrica_uso_acumulada` y `notas_estado` para `unidad_equipo`.
- El frontend usaba `codigoInventario`, `marca`, `modelo` y `ubicacion`, que no existen en la base de datos.
- Los estados no coincidían entre el diccionario de datos, el enum Java, los datos semilla y el frontend.

## 2. Problema
Definir qué capa manda en los nombres de campos y en los valores permitidos, para que el CRUD 1:N funcione de punta a punta.

## 3. Alternativas consideradas
1. Alinear el frontend a los DTO del backend y al DER.
2. Agregar al esquema las columnas que usaba el frontend (migración nueva y cambio del DER).

## 4. Decisión
- **Contrato:** manda el DTO del backend, que refleja el DER. Las interfaces TypeScript conservan sus nombres (`UnidadEquipo`, `Mantenimiento`) y adoptan los campos de `UnidadEquipoResponse` y `MantenimientoResponse`.
- **`unidad_equipo.estado_operativo`:** manda el diccionario de datos: `DISPONIBLE, RESERVADA, EN_USO, EN_MANTENIMIENTO, DE_BAJA`.
- **`mantenimiento.tipo` y `mantenimiento.estado`:** manda el enum Java, que es lo que la API ya aceptaba: `PREVENTIVO, CORRECTIVO` y `EN_PROCESO, COMPLETADO, CANCELADO`. El diccionario se actualizó.

## 5. Consecuencias
- `V3__normalizar_estados_y_checks.sql` traduce los valores antiguos (`ALQUILADO`, `EN_TALLER`, `EN_REVISION`, `BAJA`) y crea los CHECK.
- El backend valida los catálogos con `@Pattern` y responde 400 con `fieldErrors` si llega un valor fuera de lista.
- El frontend deja de mostrar columnas vacías y deja de enviar valores que el backend rechazaba.
