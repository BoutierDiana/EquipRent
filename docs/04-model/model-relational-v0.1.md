# EquipRent — Modelo relacional v0.1

## 1. Fuente
- **Proyecto oficial:** EquipRent — Sistema de Gestión Integral de Alquiler de Maquinaria y Equipos.
- **Modelo conceptual base:** `model-conceptual-v0.1.md`
- **Flujo crítico utilizado:**
  `[Operador] Registra Cliente` ➔ `[Operador] Consulta Disponibilidad por Fechas` ➔ `[Operador] Reserva Unidades Físicas (Valida no solapamiento)` ➔ `[Operador] Registra Entrega Física en Retiro (Valida depósito/reserva)` ➔ `[Cliente] Consulta Estado en Móvil` ➔ `[Técnico] Realiza Inspección Física en Retorno` ➔ `[Operador/Técnico] Registra Devolución y Daño` ➔ `[Sistema] Unidad pasa a Disponible o Mantenimiento/Bloqueada`.

---

## 2. Criterios de transformación
- **Estrategia de PKs:** Se proponen identificadores técnicos/sustitutos estables (`<tabla>_id`) como PK para simplificar referencias y desacoplar la base de datos de mutaciones de negocio.
- **Relaciones 1:N:** La clave foránea (FK) se ubica estrictamente en la tabla del lado N, referenciando la PK de la tabla del lado 1.
- **Relaciones N:M:** Resueltas mediante tablas puente intermedias (`reserva_detalle`) que contienen atributos propios de la relación.
- **Optionalidad:** Registrada explícitamente como obligatoria u opcional antes de la definición física en SQL.
- **Claves Naturales y Unicidad:** Registradas como restricciones candidatas a `UNIQUE` para preservar reglas de negocio (RN-01, RN-02).

---

## 3. Tablas candidatas núcleo

### cliente
**Propósito:** Representa a la persona natural o jurídica que contrata el servicio, asume custodia y deja garantía.
- `cliente_id` [PK propuesta]
- `tipo_documento`
- `numero_documento`
- `nombre_completo`
- `telefono`
- `email`
- `estado_credito`
*Reglas relacionadas:* RF-04, RF-16

### categoria_equipo
**Propósito:** Representa la agrupación lógica para organizar el catálogo de productos.
- `categoria_equipo_id` [PK propuesta]
- `nombre`
- `descripcion`
*Reglas relacionadas:* RF-01, Sección F

### equipo
**Propósito:** Representa el modelo o producto genérico del catálogo con especificaciones y tarifas comunes.
- `equipo_id` [PK propuesta]
- `categoria_equipo_id` [FK -> categoria_equipo.categoria_equipo_id]
- `codigo_modelo`
- `nombre`
- `marca`
- `descripcion`
- `deposito_base_sugerido`
*Reglas relacionadas:* RF-01, Sección D

### unidad_equipo
**Propósito:** Representa el activo tangible, individual e irrepetible que se despacha, se desgasta y se repara.
- `unidad_equipo_id` [PK propuesta]
- `equipo_id` [FK -> equipo.equipo_id]
- `numero_serie`
- `estado_operativo`
- `metrica_uso_acumulada`
*Reglas relacionadas:* RN-01, RN-02, RF-02, RF-15

### tarifa
**Propósito:** Representa la regla de precio aplicable por unidad de tiempo a un modelo de equipo.
- `tarifa_id` [PK propuesta]
- `equipo_id` [FK -> equipo.equipo_id]
- `modalidad`
- `precio`
- `vigente`
*Reglas relacionadas:* RF-03, Sección F

### reserva
**Propósito:** Representa el compromiso formal de fechas y bloqueo de disponibilidad para un cliente.
- `reserva_id` [PK propuesta]
- `codigo_reserva`
- `cliente_id` [FK -> cliente.cliente_id]
- `usuario_id` [FK -> usuario.usuario_id]
- `fecha_inicio_programada`
- `fecha_fin_programada`
- `estado`
*Reglas relacionadas:* RN-02, RN-04, RN-09, RF-06, RF-08

### reserva_detalle
**Propósito:** Representa la asignación específica de una unidad física tangible a una reserva con su tarifa congelada.
- `reserva_detalle_id` [PK propuesta]
- `reserva_id` [FK -> reserva.reserva_id]
- `unidad_equipo_id` [FK -> unidad_equipo.unidad_equipo_id]
- `tarifa_id` [FK -> tarifa.tarifa_id]
- `precio_pactado`
*Reglas relacionadas:* RN-02, RF-06, Sección F

### deposito
**Propósito:** Representa el respaldo económico o garantía operativa retenida durante el alquiler.
- `deposito_id` [PK propuesta]
- `reserva_id` [FK -> reserva.reserva_id]
- `monto_recibido`
- `monto_retenido_danos`
- `monto_devuelto`
- `estado`
*Reglas relacionadas:* RN-08, RF-10

### entrega
**Propósito:** Representa el evento operativo donde se transfiere la custodia física de las unidades al cliente.
- `entrega_id` [PK propuesta]
- `reserva_id` [FK -> reserva.reserva_id]
- `usuario_operador_id` [FK -> usuario.usuario_id]
- `fecha_hora_salida`
- `metrica_salida`
- `observaciones_salida`
*Reglas relacionadas:* RN-04, RN-05, RF-09

### devolucion
**Propósito:** Representa el evento de reingreso físico del activo al almacén, cortando el tiempo de arriendo.
- `devolucion_id` [PK propuesta]
- `entrega_id` [FK -> entrega.entrega_id]
- `usuario_operador_id` [FK -> usuario.usuario_id]
- `fecha_hora_retorno`
- `metrica_retorno`
*Reglas relacionadas:* RN-06, RF-11

### inspeccion
**Propósito:** Representa el peritaje técnico obligatorio sobre el equipo devuelto antes de su liberación.
- `inspeccion_id` [PK propuesta]
- `devolucion_id` [FK -> devolucion.devolucion_id]
- `usuario_tecnico_id` [FK -> usuario.usuario_id]
- `resultado`
- `checklist_aprobado`
- `observaciones`
*Reglas relacionadas:* RN-06, RF-12

### dano
**Propósito:** Representa la avería o deterioro detectado durante la inspección técnica.
- `dano_id` [PK propuesta]
- `inspeccion_id` [FK -> inspeccion.inspeccion_id]
- `unidad_equipo_id` [FK -> unidad_equipo.unidad_equipo_id]
- `descripcion`
- `costo_estimado_reparacion`
- `imputable_cliente`
*Reglas relacionadas:* RN-07, RF-13

### mantenimiento
**Propósito:** Representa el período de bloqueo en taller para reparación correctiva o preventiva.
- `mantenimiento_id` [PK propuesta]
- `unidad_equipo_id` [FK -> unidad_equipo.unidad_equipo_id]
- `dano_id` [FK -> dano.dano_id]
- `tipo`
- `fecha_ingreso`
- `fecha_egreso_estimada`
- `fecha_egreso_real`
- `estado`
*Reglas relacionadas:* RN-07, RF-14

---

## 4. Relaciones

- `categoria_equipo` 1:N `equipo` — *Justificación:* Una categoría agrupa múltiples modelos; cada modelo pertenece a una categoría (RF-01).
- `equipo` 1:N `unidad_equipo` — *Justificación:* Un modelo del catálogo tipifica a múltiples activos físicos individuales con número de serie (RN-01, RF-02).
- `equipo` 1:N `tarifa` — *Justificación:* Un equipo define uno o varios esquemas tarifarios vigentes (RF-03).
- `cliente` 1:N `reserva` — *Justificación:* Un cliente solicita múltiples reservas en el tiempo (RF-04, RF-06).
- `reserva` 1:N `reserva_detalle` — *Justificación:* Una reserva desglosa de 1 a N unidades comprometidas (RF-06).
- `reserva` 1:1 `deposito` — *Justificación:* Una reserva formalizada cuenta con un registro de garantía operativo (RN-08, RF-10).
- `reserva` 1:1 `entrega` — *Justificación:* Una reserva confirmada deriva en un único evento de despacho de los activos (RN-05, RF-09).
- `entrega` 1:1 `devolucion` — *Justificación:* Un despacho físico concluye en un único evento de retorno (RN-06, RF-11).
- `devolucion` 1:1 `inspeccion` — *Justificación:* Toda devolución exige obligatoriamente un peritaje técnico (RN-06, RF-12).
- `inspeccion` 1:N `dano` — *Justificación:* Una inspección técnica puede detectar 0, 1 o múltiples daños (RF-13).
- `unidad_equipo` 1:N `mantenimiento` — *Justificación:* Una unidad puede ingresar a taller en múltiples ocasiones a lo largo de su vida útil (RN-07, RF-14).

---

## 5. Relaciones N:M

- `reserva` N:M `unidad_equipo` ➔ **`reserva_detalle`**
  - *Atributos propios de la relación:* `tarifa_id` (FK), `precio_pactado`.
  - *Justificación:* Una reserva agrupa múltiples unidades físicas, y una unidad física participa en muchas reservas en períodos temporales distintos (RN-02).

---

## 6. Claves naturales / UNIQUE candidatas

- `cliente.(tipo_documento, numero_documento)` — *Justificación:* No pueden existir dos clientes con el mismo documento oficial de identidad (RF-04).
- `unidad_equipo.numero_serie` — *Justificación:* El código de serie o placa patrimonial distingue de forma irrepetible a cada ejemplar físico (RN-01).
- `equipo.codigo_modelo` — *Justificación:* El código de catálogo / SKU es único dentro del catálogo de la empresa (RF-01).
- `reserva.codigo_reserva` — *Justificación:* Código alfanumérico amigable único para búsqueda y trazabilidad del cliente (RF-06).
- `reserva_detalle.(reserva_id, unidad_equipo_id)` — *Justificación:* Evita que una misma unidad física sea duplicada dentro de la misma reserva.
- `tarifa.(equipo_id, modalidad, vigente)` — *Justificación:* No puede haber más de una tarifa activa para la misma modalidad en un modelo de equipo (RF-03).

---

## 7. Optionalidad

- `equipo.categoria_equipo_id`: **Obligatoria** — Un modelo de equipo no puede existir sin una categoría asociada.
- `unidad_equipo.equipo_id`: **Obligatoria** — Una unidad física debe pertenecer obligatoriamente a un modelo de catálogo.
- `tarifa.equipo_id`: **Obligatoria** — Una tarifa existe únicamente vinculada a un equipo.
- `reserva.cliente_id`: **Obligatoria** — Toda reserva debe estar a nombre de un cliente registrado.
- `reserva_detalle.reserva_id`: **Obligatoria** — Una línea de detalle no existe sin una cabecera de reserva.
- `reserva_detalle.unidad_equipo_id`: **Obligatoria** — Toda línea de reserva debe comprometer una unidad física específica.
- `entrega.reserva_id`: **Obligatoria** — Todo despacho físico proviene de una reserva formalizada (RN-05).
- `devolucion.entrega_id`: **Obligatoria** — Una devolución solo existe si hubo una entrega previa.
- `inspeccion.devolucion_id`: **Obligatoria** — La inspección perita una devolución recién ocurrida (RN-06).
- `mantenimiento.unidad_equipo_id`: **Obligatoria** — El mantenimiento se aplica siempre sobre una unidad física real.
- `mantenimiento.dano_id`: **Opcional** — Es nulo cuando el ingreso a taller es preventivo o por desgaste ordinario; se enlaza si proviene de un daño post-alquiler (RN-07).
- `mantenimiento.fecha_egreso_real`: **Opcional** — Permanece nulo mientras la unidad siga en reparación dentro del taller.

---

## 8. Reglas iniciales de integridad

- **RI-01 (No Solapamiento Temporal):** No pueden existir dos filas en `reserva_detalle` con la misma `unidad_equipo_id` cuyas `reserva` asociadas compartan solapamiento en el rango `[fecha_inicio_programada, fecha_fin_programada]` (RN-02).
- **RI-02 (Bloqueo Operativo):** Una `unidad_equipo` con un `mantenimiento` donde `fecha_egreso_real IS NULL` no puede ser asignada en `reserva_detalle` ni despachada en `entrega` (RN-07).
- **RI-03 (Consistencia de Fechas):** En `reserva`, `fecha_fin_programada > fecha_inicio_programada`. En `mantenimiento`, `fecha_egreso_estimada >= fecha_ingreso`.
- **RI-04 (Consistencia de Métricas):** En la devolución de una unidad, `devolucion.metrica_retorno >= entrega.metrica_salida`.
- **RI-05 (Montos No Negativos):** `precio_pactado >= 0`, `monto_recibido >= 0`, `monto_retenido_danos >= 0` y `monto_retenido_danos <= monto_recibido`.

---

## 9. Decisiones pendientes

- **D-01 (Soporte de Entregas Parciales):** En v0.1 se asume que todas las unidades de una reserva se despachan en una sola entrega. Si en el futuro se requieren retiros escalonados, se creará una tabla `entrega_detalle`.
- **D-02 (Cálculo de Disponibilidad):** Confirmado que la disponibilidad no es una tabla física; se calculará mediante consultas dinámicas indexadas por rangos de fechas (RN-03).
- **D-03 (Claves Técnicas Físicas):** Para la Clase 04 se definirá si las PK técnicas serán `UUID` o `BIGINT GENERATED ALWAYS AS IDENTITY` según la convención del stack Spring Boot + PostgreSQL.

---

## 10. Revisión de normalización básica

- **Listas multivaluadas detectadas/corregidas:** Ninguna tabla almacena listas separadas por comas. El conjunto de herramientas alquiladas se desglosó formalmente en la tabla puente `reserva_detalle` (Cumple 1FN).
- **Columnas repetitivas detectadas/corregidas:** Se evitó el uso de columnas como `equipo1`, `equipo2`, `dano1`, `dano2`. Los daños se normalizaron en filas independientes en la tabla `dano` (Cumple 1FN y 2FN).
- **Datos redundantes detectados/corregidos:** La marca, modelo y especificaciones solo residen en `equipo`; `unidad_equipo` almacena únicamente su número de serie, estado y horómetro propio, evitando redundancia transitiva (Cumple 3FN).