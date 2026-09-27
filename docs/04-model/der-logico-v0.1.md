# DER lógico v0.1 — EquipRent

## Convenciones
- **PK** = Clave Primaria técnica / sustituta
- **FK** = Clave Foránea referencial
- **UQ** = Restricción de Unicidad (Global o Compuesta)
- **NN** = Not Null (Obligatorio)
- **NULL** = Opcional (Permite nulos)

---

## Lista Oficial de Entidades Núcleo (15)

1. `usuario`
2. `cliente`
3. `categoria_equipo`
4. `equipo`
5. `tarifa`
6. `unidad_equipo`
7. `reserva`
8. `reserva_detalle`
9. `deposito`
10. `entrega`
11. `devolucion`
12. `inspeccion`
13. `dano`
14. `mantenimiento`
15. `auditoria_excepcion`

---

## Tablas del Núcleo

### 1. usuario
- **PK** `usuario_id`
- **NN** `username`
- **NN** `email`
- **NN** `password_hash`
- **NN** `rol`
- **NN** `activo`
- **UQ** (`username`) [Global]
- **UQ** (`email`) [Global]

### 2. cliente
- **PK** `cliente_id`
- **NN** `tipo_documento`
- **NN** `numero_documento`
- **NN** `nombre_completo`
- **NN** `telefono`
- **NN** `email`
- **NN** `estado_credito`
- **UQ** (`tipo_documento`, `numero_documento`) [Compuesta]

### 3. categoria_equipo
- **PK** `categoria_equipo_id`
- **NN** `nombre`
- **NULL** `descripcion`
- **UQ** (`nombre`) [Global]

### 4. equipo
- **PK** `equipo_id`
- **FK** `categoria_equipo_id` -> `categoria_equipo.categoria_equipo_id` [NN]
- **NN** `codigo_modelo`
- **NN** `nombre`
- **NN** `marca`
- **NULL** `descripcion`
- **NN** `deposito_base_sugerido`
- **UQ** (`codigo_modelo`) [Global]

### 5. tarifa
- **PK** `tarifa_id`
- **FK** `equipo_id` -> `equipo.equipo_id` [NN]
- **NN** `modalidad`
- **NN** `precio`
- **NN** `vigente`
- **UQ** (`equipo_id`, `modalidad`, `vigente`) [Compuesta / Contextual]

### 6. unidad_equipo
- **PK** `unidad_equipo_id`
- **FK** `equipo_id` -> `equipo.equipo_id` [NN]
- **NN** `numero_serie`
- **NN** `estado_operativo`
- **NN** `metrica_uso_acumulada`
- **NULL** `notas_estado`
- **UQ** (`numero_serie`) [Global]

### 7. reserva
- **PK** `reserva_id`
- **FK** `cliente_id` -> `cliente.cliente_id` [NN]
- **FK** `usuario_creador_id` -> `usuario.usuario_id` [NN]
- **NN** `codigo_reserva`
- **NN** `fecha_inicio_programada`
- **NN** `fecha_fin_programada`
- **NN** `estado`
- **UQ** (`codigo_reserva`) [Global]

### 8. reserva_detalle
- **PK** `reserva_detalle_id`
- **FK** `reserva_id` -> `reserva.reserva_id` [NN]
- **FK** `unidad_equipo_id` -> `unidad_equipo.unidad_equipo_id` [NN]
- **FK** `tarifa_id` -> `tarifa.tarifa_id` [NN]
- **NN** `precio_pactado`
- **UQ** (`reserva_id`, `unidad_equipo_id`) [Compuesta]

### 9. deposito
- **PK** `deposito_id`
- **FK** `reserva_id` -> `reserva.reserva_id` [NN]
- **NN** `monto_recibido`
- **NN** `monto_retenido_danos`
- **NN** `monto_devuelto`
- **NN** `estado`
- **UQ** (`reserva_id`) [Global / 1:1]

### 10. entrega
- **PK** `entrega_id`
- **FK** `reserva_id` -> `reserva.reserva_id` [NN]
- **FK** `usuario_operador_id` -> `usuario.usuario_id` [NN]
- **NN** `fecha_hora_salida`
- **NN** `metrica_salida`
- **NULL** `observaciones_salida`
- **UQ** (`reserva_id`) [Global / 1:1]

### 11. devolucion
- **PK** `devolucion_id`
- **FK** `entrega_id` -> `entrega.entrega_id` [NN]
- **FK** `usuario_operador_id` -> `usuario.usuario_id` [NN]
- **NN** `fecha_hora_retorno`
- **NN** `metrica_retorno`
- **NULL** `observaciones_retorno`
- **UQ** (`entrega_id`) [Global / 1:1]

### 12. inspeccion
- **PK** `inspeccion_id`
- **FK** `devolucion_id` -> `devolucion.devolucion_id` [NN]
- **FK** `usuario_tecnico_id` -> `usuario.usuario_id` [NN]
- **NN** `resultado`
- **NN** `checklist_aprobado`
- **NULL** `observaciones`
- **UQ** (`devolucion_id`) [Global / 1:1]

### 13. dano
- **PK** `dano_id`
- **FK** `inspeccion_id` -> `inspeccion.inspeccion_id` [NN]
- **FK** `unidad_equipo_id` -> `unidad_equipo.unidad_equipo_id` [NN]
- **NN** `descripcion`
- **NN** `costo_estimado_reparacion`
- **NN** `imputable_cliente`

### 14. mantenimiento
- **PK** `mantenimiento_id`
- **FK** `unidad_equipo_id` -> `unidad_equipo.unidad_equipo_id` [NN]
- **FK** `dano_id` -> `dano.dano_id` [NULL]
- **NN** `tipo`
- **NN** `fecha_ingreso`
- **NN** `fecha_egreso_estimada`
- **NULL** `fecha_egreso_real`
- **NN** `estado`

### 15. auditoria_excepcion
- **PK** `auditoria_excepcion_id`
- **FK** `usuario_autorizador_id` -> `usuario.usuario_id` [NN]
- **NN** `tipo_excepcion`
- **NN** `entidad_afectada`
- **NN** `registro_afectado_id`
- **NN** `justificacion`
- **NN** `fecha_hora`

---

## Relaciones

| # | Origen | Cardinalidad | Destino | Clave Foránea / Vínculo |
|---|---|:---:|---|---|
| 1 | `categoria_equipo` | **1 ---- N** | `equipo` | `equipo.categoria_equipo_id` |
| 2 | `equipo` | **1 ---- N** | `unidad_equipo` | `unidad_equipo.equipo_id` |
| 3 | `equipo` | **1 ---- N** | `tarifa` | `tarifa.equipo_id` |
| 4 | `cliente` | **1 ---- N** | `reserva` | `reserva.cliente_id` |
| 5 | `usuario` | **1 ---- N** | `reserva` | `reserva.usuario_creador_id` |
| 6 | `reserva` | **1 ---- N** | `reserva_detalle` | `reserva_detalle.reserva_id` |
| 7 | `unidad_equipo` | **1 ---- N** | `reserva_detalle` | `reserva_detalle.unidad_equipo_id` |
| 8 | `tarifa` | **1 ---- N** | `reserva_detalle` | `reserva_detalle.tarifa_id` |
| 9 | `reserva` | **1 ---- 1** | `deposito` | `deposito.reserva_id` (`UQ`) |
| 10 | `reserva` | **1 ---- 1** | `entrega` | `entrega.reserva_id` (`UQ`) |
| 11 | `usuario` | **1 ---- N** | `entrega` | `entrega.usuario_operador_id` |
| 12 | `entrega` | **1 ---- 1** | `devolucion` | `devolucion.entrega_id` (`UQ`) |
| 13 | `usuario` | **1 ---- N** | `devolucion` | `devolucion.usuario_operador_id` |
| 14 | `devolucion` | **1 ---- 1** | `inspeccion` | `inspeccion.devolucion_id` (`UQ`) |
| 15 | `usuario` | **1 ---- N** | `inspeccion` | `inspeccion.usuario_tecnico_id` |
| 16 | `inspeccion` | **1 ---- N** | `dano` | `dano.inspeccion_id` |
| 17 | `unidad_equipo` | **1 ---- N** | `dano` | `dano.unidad_equipo_id` |
| 18 | `unidad_equipo` | **1 ---- N** | `mantenimiento` | `mantenimiento.unidad_equipo_id` |
| 19 | `dano` | **1 ---- 0..1** | `mantenimiento` | `mantenimiento.dano_id` |
| 20 | `usuario` | **1 ---- N** | `auditoria_excepcion` | `auditoria_excepcion.usuario_autorizador_id` |

---

## Reglas de Negocio que Afectan el Modelo

- **RN-01 (Identidad Única):** Cada activo físico individual tiene un código único irrepetible -> *Decisión:* `unidad_equipo.numero_serie` con restricción `UQ` global.
- **RN-02 / RN-03 (No Solapamiento y Disponibilidad Dinámica):** Una unidad no puede estar en dos reservas con fechas cruzadas -> *Decisión:* `reserva_detalle` vincula la unidad; la validación temporal se resuelve a nivel backend/transaccional indexando los rangos `[fecha_inicio_programada, fecha_fin_programada]`.
- **RN-04 / RN-05 (Reserva no es Entrega):** Se separa formalmente la reserva del despacho físico -> *Decisión:* Entidades separadas `reserva` y `entrega` (con FK obligatoria `entrega.reserva_id` y `UQ` 1:1).
- **RN-06 (Inspección Obligatoria de Retorno):** Todo retorno de custodia exige peritaje técnico -> *Decisión:* Relación 1:1 obligatoria `devolucion` ➔ `inspeccion`.
- **RN-07 (Bloqueo por Daño):** Un daño detectado puede enviar la unidad a taller -> *Decisión:* `mantenimiento.dano_id` vincula el siniestro con la orden de taller, dejando `unidad_equipo.estado_operativo` en `EN_MANTENIMIENTO`.
- **RN-08 (Control de Depósito Operativo):** Garantía vinculada a la reserva para respaldo -> *Decisión:* `deposito.reserva_id` con `UQ` 1:1 y control de saldos `monto_recibido >= monto_retenido_danos + monto_devuelto`.
- **RN-10 (Inmutabilidad Histórica):** Prohibición de borrado físico de eventos -> *Decisión:* `auditoria_excepcion`, `entrega`, `devolucion` e `inspeccion` no admiten sentencias `DELETE`.