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
| CategoriaEquipo | Entidad | Agrupa conceptualmente los modelos de equipos para estructurar el catálogo. | Sección F |
| Equipo | Entidad | Modelo o tipo genérico en el catálogo con especificaciones y tarifas base. | Sección D, F, RF-01 |
| UnidadEquipo | Entidad | Activo físico real e individualizado que se entrega, inspecciona y repara. | RN-01, RN-02, RF-02, RF-15 |
| Tarifa | Entidad | Regla que define el costo de alquiler por unidad de tiempo. | RF-03, Sección F |
| Reserva | Entidad | Compromiso temporal para apartar activos en un rango de fechas. | RN-04, RN-09, RF-06, RF-08 |
| ReservaDetalle | Entidad (Dependiente) | Desglose de cada unidad física asignada a una reserva. | RF-06, Sección F |
| Entrega | Entidad (Evento) | Registro operativo del traspaso de custodia física del equipo al cliente. | RN-04, RN-05, RF-09 |
| Devolucion | Entidad (Evento) | Registro del retorno físico de la custodia del equipo a la empresa. | RN-06, RF-11 |
| Inspeccion | Entidad (Evento) | Peritaje técnico obligatorio sobre una unidad retornada. | RF-12, Sección C |
| Dano | Entidad | Avería detectada que justifica bloqueo y afectación de garantía. | RN-07, RF-13 |
| Mantenimiento | Entidad | Bloqueo de una unidad en taller para reparación o revisión preventiva. | RF-14, Flujo J |
| Deposito | Entidad | Respaldo económico retenido temporalmente durante el alquiler. | RN-08, RF-10 |
| Usuario / Rol | Entidad / Actor | Operadores, técnicos y supervisores que operan el sistema. | Sección C, RF-18 |
| Auditoria | Entidad (Historial) | Bitácora inmutable de autorizaciones especiales y excepciones. | RN-10, RF-18 |
| Disponibilidad | Concepto Derivado | Estado dinámico calculado evaluando unidades libres de reservas y bloqueos. | RN-02, RN-03, RF-05 |

## 4. Entidades núcleo v0.1

### Cliente
- **Responsabilidad:** Representar a la persona natural o jurídica que contrata el servicio.
- **Atributos conceptuales:** Documento de identidad, nombre completo, teléfono, correo, estado crediticio.
- **Identificador de negocio candidato:** Número de documento de identidad (DNI / CI / NIT).

### Equipo (Modelo / Catálogo)
- **Responsabilidad:** Definir las características técnicas y comerciales de un modelo.
- **Atributos conceptuales:** Modelo, marca, descripción técnica, depósito estándar sugerido.
- **Identificador de negocio candidato:** Código de catálogo / SKU del modelo.

### UnidadEquipo (Activo Físico Individual)
- **Responsabilidad:** Representar cada ejemplar tangible sujeto a alquiler y desgaste.
- **Atributos conceptuales:** Número de serie / placa patrimonial, estado operativo actual, métrica acumulada.
- **Identificador de negocio candidato:** Número de serie físico o código patrimonial.

### Reserva
- **Responsabilidad:** Formalizar el compromiso de alquiler en un período delimitado.
- **Atributos conceptuales:** Fecha/hora de inicio programado, fecha/hora de fin programado, estado.
- **Identificador de negocio candidato:** Código alfanumérico único de reserva.

### ReservaDetalle
- **Responsabilidad:** Asociar las unidades físicas asignadas y las tarifas pactadas a una reserva.
- **Atributos conceptuales:** Precio unitario pactado, fecha/hora de asignación.
- **Identificador de negocio candidato:** Clave compuesta (Reserva + Unidad física).

### Entrega
- **Responsabilidad:** Constatar el despacho y traspaso de custodia física del equipo al cliente.
- **Atributos conceptuales:** Fecha y hora exacta de retiro, métrica de salida (horómetro/odómetro).
- **Identificador de negocio candidato:** Número de comprobante de despacho.

### Devolucion
- **Responsabilidad:** Constatar el retorno físico del equipo a las instalaciones.
- **Atributos conceptuales:** Fecha y hora exacta de retorno, métrica de llegada.
- **Identificador de negocio candidato:** Número de comprobante de devolución.

### Inspeccion
- **Responsabilidad:** Evaluar el estado técnico del equipo devuelto antes de liberarlo.
- **Atributos conceptuales:** Resultado (Conforme / Con daño), observaciones técnicas.
- **Identificador de negocio candidato:** Código de reporte pericial.

### Dano
- **Responsabilidad:** Detallar la avería encontrada y cuantificar el impacto económico.
- **Atributos conceptuales:** Descripción del daño, costo estimado, indicador de imputabilidad al cliente.
- **Identificador de negocio candidato:** Código de siniestro.

### Deposito
- **Responsabilidad:** Administrar la garantía financiera entregada por el cliente.
- **Atributos conceptuales:** Monto recibido, monto deducido por daños, monto devuelto, estado.
- **Identificador de negocio candidato:** Recibo de garantía.

## 5. Relaciones
- CategoriaEquipo **agrupa** Equipos.
- Equipo **tipifica** UnidadesEquipo individuales.
- Equipo **tiene** Tarifas asociadas.
- Cliente **solicita** Reservas.
- Reserva **desglosa** ReservaDetalle.
- UnidadEquipo **es asignada en** ReservaDetalle.
- Reserva **recibe** Deposito de garantía.
- Reserva **origina** una Entrega física.
- Entrega **concluye en** una Devolucion física.
- Devolucion **exige** una Inspeccion técnica obligatoria.
- Inspeccion **puede detectar** Danos.
- UnidadEquipo **ingresa a** Mantenimiento cuando presenta daños o revisión preventiva.
- Usuario / Rol **registra y autoriza** eventos operativos y de auditoría.

## 6. Cardinalidades

| Relación | Cardinalidad | Justificación |
|---|---|---|
| CategoriaEquipo — Equipo | 1 : 0..N | Una categoría agrupa múltiples modelos. |
| Equipo — UnidadEquipo | 1 : 0..N | Un modelo tiene múltiples unidades físicas reales. |
| Cliente — Reserva | 1 : 0..N | Un cliente solicita múltiples reservas en el tiempo. |
| Reserva — ReservaDetalle | 1 : 1..N | Una reserva contiene al menos una unidad física. |
| Reserva — Deposito | 1 : 0..1 | Cada reserva cuenta con un registro de garantía. |
| Reserva — Entrega | 1 : 0..1 | Una reserva confirmada deriva en un despacho físico. |
| Entrega — Devolucion | 1 : 0..1 | Un despacho físico concluye en un retorno al almacén. |
| Devolucion — Inspeccion | 1 : 1 | Toda devolución exige obligatoriamente un peritaje. |
| Inspeccion — Dano | 1 : 0..N | Una inspección puede no registrar daños o hallar varios. |
| UnidadEquipo — Mantenimiento | 1 : 0..N | Una unidad puede ingresar a taller múltiples veces. |

## 7. Reglas iniciales de integridad
- **RI-01 (No Solapamiento Temporal):** Una `UnidadEquipo` no puede asociarse a dos `ReservaDetalle` cuyos rangos de fechas se superpongan (RN-02).
- **RI-02 (Bloqueo por Mantenimiento):** Una `UnidadEquipo` en `Mantenimiento` no puede reservarse ni entregarse (RN-07).
- **RI-03 (Inspección Obligatoria):** Ninguna `Devolucion` concluye ni la unidad vuelve a estar disponible sin una `Inspeccion` cerrada (RN-06).
- **RI-04 (Despacho Condicionado):** Toda `Entrega` requiere reserva confirmada y depósito registrado (RN-05, RN-08).
- **RI-05 (Consistencia de Métricas):** La métrica de retorno debe ser mayor o igual a la métrica de salida.
- **RI-06 (Inmutabilidad Histórica):** Los registros de eventos operativos no pueden eliminarse (RN-10).

## 8. Dudas y decisiones
- **D-01:** Se modela la entrega vinculada a la reserva grupal para el MVP.
- **D-02:** La disponibilidad se calcula dinámicamente sobre reservas y mantenimientos; no es una tabla estática.
- **D-03:** Se incluye la entidad `Auditoria` para trazar excepciones y decisiones manuales de supervisores.

## 9. Trazabilidad inicial

| Concepto / Relación | RN / RF asociado |
|---|---|
| UnidadEquipo (Identidad y Estado) | RN-01, RF-02, RF-15 |
| Disponibilidad Dinámica | RN-02, RN-03, RF-05, RF-07 |
| Reserva vs. Entrega | RN-04, RN-05, RF-06, RF-09 |
| Devolucion — Inspeccion | RN-06, RF-11, RF-12 |
| Dano — Mantenimiento | RN-07, RF-13, RF-14 |
| Deposito de Garantía | RN-08, RF-10 |
| Auditoria Inmutable | RN-10, RF-18 |

## 10. Pendientes para Clase 03
- Transformar conceptos en tablas lógicas relacionales.
- Definir PKs sustitutas, FKs y restricciones UNIQUE.
- Resolver la relación N:M entre reservas y unidades.
- Validar normalización (1FN, 2FN, 3FN).