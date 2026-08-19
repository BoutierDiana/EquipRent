# Modelo conceptual v0.1 — EquipRent

## 1. Objetivo

Este documento identifica los conceptos principales del dominio, sus atributos conceptuales, relaciones, cardinalidades y primeras reglas de integridad para el sistema de alquiler de herramientas, maquinaria ligera y equipos audiovisuales **EquipRent**.

## 2. Fuente analizada

- Proyecto asignado: EquipRent
- Secciones revisadas: A (Situación del cliente), B (Objetivo contractual), C (Actores), D (Alcance funcional), E (Reglas de negocio), F (Modelo de información mínimo), G (Requisitos funcionales) y J (Flujo crítico).

## 3. Candidatos analizados

| Concepto | Clasificación | Justificación | Fuente |
|---|---|---|---|
| Cliente | Entidad | Persona o empresa que contrata el servicio, asume custodia y deja depósito de garantía. | Sección C, D, RF-04, RF-16 |
| CategoriaEquipo | Entidad | Agrupa conceptualmente los modelos de equipos para estructurar y filtrar el catálogo. | Sección F |
| Equipo | Entidad | Modelo o tipo genérico en el catálogo con especificaciones y tarifas base comunes. | Sección D, F, RF-01 |
| UnidadEquipo | Entidad | Activo físico real, individual e irrepetible que se entrega, inspecciona y repara. | RN-01, RN-02, RF-02, RF-15 |
| Tarifa | Entidad | Regla o valor que define el costo de alquiler por unidad de tiempo. | RF-03, Sección F |
| Reserva | Entidad | Compromiso temporal formalizado para apartar activos en un rango de fechas. | RN-04, RN-09, RF-06, RF-08 |
| ReservaDetalle | Entidad (Dependiente) | Desglose de cada unidad física o tipo asignado a una reserva grupal. | RF-06, Sección F |
| Entrega | Entidad (Evento) | Registro operativo del traspaso físico de la custodia del equipo al cliente. | RN-04, RN-05, RF-09 |
| Devolucion | Entidad (Evento) | Registro del retorno físico de la custodia del equipo a la empresa. | RN-06, RF-11 |
| Inspeccion | Entidad (Evento) | Peritaje técnico obligatorio sobre una unidad retornada para evaluar su condición. | RF-12, Sección C |
| Dano | Entidad | Avería o deterioro detectado que justifica bloqueo y afectación de garantía. | RN-07, RF-13 |
| Mantenimiento | Entidad | Período de bloqueo de una unidad en taller para reparación o revisión preventiva. | RF-14, Flujo J |
| Deposito | Entidad | Respaldo económico operativo retenido temporalmente durante el alquiler. | RN-08, RF-10 |
| Usuario / Rol | Entidad / Actor | Operadores, técnicos y supervisores que operan el sistema y generan trazabilidad. | Sección C, RF-18 |
| Auditoria | Entidad (Historial) | Bitácora inmutable de autorizaciones especiales, excepciones y mutaciones críticas. | RN-10, RF-18 |
| Disponibilidad | Concepto Derivado / Regla | Estado dinámico calculado evaluando unidades libres de reservas y bloqueos por fecha. | RN-02, RN-03, RF-05 |
| EstadoOperativo | Atributo / Estado | Cualidad de la unidad (Disponible, En uso, Dañada, En mantenimiento). | RN-01, RN-07 |
| IdentificadorFisico | Atributo Natural | Código de serie o placa patrimonial única de cada activo físico. | RN-01 |

## 4. Entidades núcleo v0.1

### Cliente
- **Responsabilidad:** Representar a la persona natural o jurídica que contrata el servicio y asume la responsabilidad civil/económica.
- **Atributos conceptuales:** Documento de identidad, nombre completo / razón social, teléfono, correo, estado crediticio.
- **Identificador de negocio candidato:** Número de documento de identidad (DNI / CI / NIT).

### CategoriaEquipo
- **Responsabilidad:** Clasificar y jerarquizar los tipos de herramientas y maquinaria disponibles.
- **Atributos conceptuales:** Nombre de la categoría, descripción operativa.
- **Identificador de negocio candidato:** Código de categoría o nombre único.

### Equipo (Modelo / Catálogo)
- **Responsabilidad:** Definir las características técnicas y comerciales de un modelo de equipo.
- **Atributos conceptuales:** Modelo, marca, descripción técnica, depósito estándar sugerido.
- **Identificador de negocio candidato:** Código de catálogo / SKU del modelo.

### UnidadEquipo (Activo Físico Individual)
- **Responsabilidad:** Representar cada ejemplar tangible e individualizado sujeto a alquiler y desgaste.
- **Atributos conceptuales:** Número de serie / placa patrimonial, estado operativo actual, métrica acumulada (horómetro / odómetro / usos).
- **Identificador de negocio candidato:** Número de serie físico o código patrimonial.

### Tarifa
- **Responsabilidad:** Definir el esquema de precios aplicable a los alquileres por unidad de tiempo.
- **Atributos conceptuales:** Modalidad (hora/día/semana), valor monetario, fecha de vigencia.
- **Identificador de negocio candidato:** Código de esquema tarifario.

### Reserva
- **Responsabilidad:** Formalizar el compromiso de alquiler para un cliente en un período delimitado.
- **Atributos conceptuales:** Fecha/hora de inicio programado, fecha/hora de fin programado, estado del ciclo de vida (Creada, Confirmada, Cancelada, Completada).
- **Identificador de negocio candidato:** Código alfanumérico único de reserva.

### ReservaDetalle
- **Responsabilidad:** Asociar las unidades físicas asignadas y las tarifas pactadas a una reserva.
- **Atributos conceptuales:** Precio unitario pactado, fecha/hora de asignación.
- **Identificador de negocio candidato:** Clave compuesta (Reserva + Unidad física).

### Entrega
- **Responsabilidad:** Constatar el despacho y traspaso de custodia física del equipo al cliente.
- **Atributos conceptuales:** Fecha y hora exacta de retiro, métrica de salida (horómetro/odómetro), notas de salida.
- **Identificador de negocio candidato:** Número de acta/comprobante de despacho.

### Devolucion
- **Responsabilidad:** Constatar el retorno físico del equipo a las instalaciones de la empresa.
- **Atributos conceptuales:** Fecha y hora exacta de retorno, métrica de llegada (horómetro/odómetro).
- **Identificador de negocio candidato:** Número de acta de devolución.

### Inspeccion
- **Responsabilidad:** Evaluar el estado técnico del equipo devuelto antes de liberarlo.
- **Atributos conceptuales:** Resultado (Conforme / Con daño), observaciones técnicas, fecha/hora de peritaje.
- **Identificador de negocio candidato:** Código de reporte pericial.

### Dano
- **Responsabilidad:** Detallar la avería encontrada en el equipo y cuantificar el impacto económico.
- **Atributos conceptuales:** Descripción del daño, costo estimado de reparación, indicador de imputabilidad al cliente.
- **Identificador de negocio candidato:** Código de siniestro/incidencia técnica.

### Mantenimiento
- **Responsabilidad:** Gestionar el bloqueo y reparación de unidades fuera de servicio.
- **Atributos conceptuales:** Tipo (preventivo/correctivo), fecha de ingreso a taller, fecha estimada/real de egreso, taller/técnico asignado.
- **Identificador de negocio candidato:** Orden de trabajo / mantenimiento.

### Deposito
- **Responsabilidad:** Administrar la garantía financiera entregada por el cliente.
- **Atributos conceptuales:** Monto recibido, monto deducido por daños/retrasos, monto devuelto, estado de liquidación.
- **Identificador de negocio candidato:** Recibo de garantía.

### Usuario / Rol
- **Responsabilidad:** Representar a los actores operativos que ejecutan acciones en el sistema.
- **Atributos conceptuales:** Nombre, correo institucional, rol (Administrador, Operador, Técnico, Supervisor), credenciales.
- **Identificador de negocio candidato:** Nombre de usuario o correo corporativo.

### Auditoria
- **Responsabilidad:** Registrar de forma inmutable todas las excepciones, autorizaciones especiales y cambios de estado críticos.
- **Atributos conceptuales:** Tipo de evento, motivo/justificación, fecha/hora, estado previo, estado nuevo.
- **Identificador de negocio candidato:** ID correlativo inmutable de evento de auditoría.

## 5. Relaciones

- CategoriaEquipo **agrupa** Equipos del catálogo.
- Equipo **tipifica** UnidadesEquipo individuales.
- Equipo **tiene** Tarifas asociadas.
- Cliente **solicita** Reservas.
- Reserva **desglosa** ReservaDetalle.
- UnidadEquipo **es asignada en** ReservaDetalle.
- Reserva **recibe** Deposito de garantía.
- Reserva **origina** una Entrega física (o se autoriza por excepción).
- Entrega **concluye en** una Devolucion física.
- Devolucion **exige** una Inspeccion técnica obligatoria.
- Inspeccion **puede detectar** Danos.
- UnidadEquipo **ingresa a** Mantenimiento cuando presenta daños o revisión preventiva.
- Usuario / Rol **registra y autoriza** eventos de Reserva, Entrega, Devolucion, Inspeccion y Auditoria.

## 6. Cardinalidades

| Relación | Cardinalidad | Justificación |
|---|---|---|
| CategoriaEquipo — Equipo | 1 : 0..N | Una categoría agrupa de cero a muchos modelos; cada modelo pertenece a una categoría. |
| Equipo — UnidadEquipo | 1 : 0..N | Un modelo de catálogo tiene cero o muchas unidades físicas reales en inventario. |
| Equipo — Tarifa | 1 : 1..N | Un modelo de equipo debe contar con al menos un esquema tarifario vigente. |
| Cliente — Reserva | 1 : 0..N | Un cliente puede registrar múltiples reservas a lo largo del tiempo. |
| Reserva — ReservaDetalle | 1 : 1..N | Una reserva debe componerse obligatoriamente de al menos una línea de detalle. |
| UnidadEquipo — ReservaDetalle | 1 : 0..N | Una unidad física puede ser programada en varias reservas (en períodos no solapados). |
| Reserva — Deposito | 1 : 0..1 | Cada reserva puede contar con un registro operativo de depósito de respaldo. |
| Reserva — Entrega | 1 : 0..1 | Una reserva formalizada deriva en un único evento de despacho de los activos. |
| Entrega — Devolucion | 1 : 0..1 | Un despacho físico concluye en un evento de retorno cuando el cliente finaliza el uso. |
| Devolucion — Inspeccion | 1 : 1 | Toda devolución de equipo exige obligatoriamente un peritaje técnico de condición. |
| Inspeccion — Dano | 1 : 0..N | Una inspección puede no encontrar averías o detectar uno o múltiples daños. |
| UnidadEquipo — Mantenimiento | 1 : 0..N | Una unidad física puede ingresar a taller en múltiples ocasiones durante su vida útil. |
| Usuario — Auditoria | 1 : 0..N | Un usuario del sistema puede generar múltiples registros de auditoría y excepciones. |

## 7. Reglas iniciales de integridad

- **RI-01 (No Solapamiento Temporal):** Una `UnidadEquipo` no puede asociarse a dos `ReservaDetalle` cuyos rangos de fechas (inicio - fin) se superpongan (RN-02).
- **RI-02 (Bloqueo por Mantenimiento):** Una `UnidadEquipo` con una orden de `Mantenimiento` abierta no puede ser asignada a reservas ni despachada en entregas (RN-07).
- **RI-03 (Inspección Obligatoria de Retorno):** Ninguna `Devolucion` puede darse por concluida ni la `UnidadEquipo` regresar al estado `Disponible` sin un registro de `Inspeccion` cerrado (RN-06).
- **RI-04 (Despacho Condicionado):** Toda `Entrega` requiere una `Reserva` confirmada y el registro del `Deposito` correspondiente, salvo autorización de supervisor registrada en `Auditoria` (RN-05, RN-08).
- **RI-05 (Consistencia de Métricas):** La métrica de retorno en la `Devolucion` (horómetro / odómetro) debe ser estrictamente mayor o igual a la métrica registrada en la `Entrega`.
- **RI-06 (Inmutabilidad Histórica):** Los registros de `Entrega`, `Devolucion`, `Inspeccion`, `Dano` y `Auditoria` son estrictamente inmutables (no pueden eliminarse) (RN-10).

## 8. Dudas y decisiones

- **D-01 (Múltiples Unidades vs. Unidades Individuales en Entrega):** Se modela la entrega vinculada a la reserva grupal, asumiendo que se despachan juntas las unidades reservadas; en la Clase 03 se evaluará si se requiere un `EntregaDetalle` por cada activo individual.
- **D-02 (Cálculo de Disponibilidad):** Se confirma que `Disponibilidad` no se almacena como tabla física; se calculará mediante consultas indexadas sobre `ReservaDetalle` y `Mantenimiento` por rangos de fecha.
- **D-03 (Trazabilidad de Excepciones):** Se determinó incluir la entidad `Auditoria` desde v0.1 para cumplir con el requisito de registrar intervenciones manuales del Supervisor.

## 9. Trazabilidad inicial

| Concepto / Relación | RN / RF asociado |
|---|---|
| UnidadEquipo (Identificador y Estado) | RN-01, RF-02, RF-15 |
| ReservaDetalle — Disponibilidad Dinámica | RN-02, RN-03, RF-05, RF-07 |
| Reserva vs. Entrega | RN-04, RN-05, RF-06, RF-09 |
| Devolucion — Inspeccion | RN-06, RF-11, RF-12 |
| Dano — Mantenimiento | RN-07, RF-13, RF-14 |
| Deposito de Garantía | RN-08, RF-10 |
| Cancelación de Reserva | RN-09, RF-08 |
| Auditoria Inmutable | RN-10, RF-18 |

## 10. Pendientes para Clase 03

- Revisar identificadores únicos y claves sustitutas (`UUID` vs. `BIGINT`).
- Transformar el modelo conceptual en modelo relacional para PostgreSQL.
- Definir PKs, FKs, tipos de datos físicos y opcionalidades (`NULL` / `NOT NULL`).
- Resolver físicamente las relaciones N:M y dependientes (`ReservaDetalle`, `InspeccionDano`).
- Aplicar normalización inicial (hasta 3FN) y diseñar scripts versionados con Flyway.