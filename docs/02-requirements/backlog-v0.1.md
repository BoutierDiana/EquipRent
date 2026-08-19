# Backlog v0.1 — EquipRent

## Convención de prioridad
- P0: imprescindible para el flujo crítico del MVP.
- P1: importante para completar la operación.
- P2: complemento posterior.

### EQ-001 — Gestionar catálogo de equipos
**Prioridad:** P0
Como administrador, quiero registrar y configurar modelos de equipos con sus especificaciones y tarifas base para estructurar el catálogo de alquiler disponible.

### EQ-002 — Registrar unidades físicas
**Prioridad:** P0
Como administrador, quiero registrar las unidades físicas individuales con su número de serie y métrica de uso inicial para controlar la trazabilidad de cada activo de manera independiente.

### EQ-003 — Registrar cliente
**Prioridad:** P0
Como operador, quiero registrar los datos y estado crediticio de un cliente para poder asociarlo legalmente a los contratos de reserva y depósitos.

### EQ-004 — Consultar disponibilidad
**Prioridad:** P0
Como operador, quiero consultar la disponibilidad de unidades en un rango de fechas específico para evitar solapamientos y confirmar al cliente qué equipos puede alquilar.

### EQ-005 — Crear reserva y depósito
**Prioridad:** P0
Como operador, quiero crear una reserva asignando unidades a un cliente y registrando su depósito de garantía para formalizar el compromiso comercial antes del retiro.

### EQ-006 — Registrar entrega física
**Prioridad:** P0
Como operador, quiero registrar el evento de entrega (despacho) para transferir la custodia del equipo al cliente y dejar constancia de la fecha, hora y odómetro de salida.

### EQ-007 — Registrar devolución
**Prioridad:** P0
Como operador, quiero registrar el retorno físico de las unidades a las instalaciones para cortar el tiempo de uso del cliente e iniciar el proceso de revisión.

### EQ-008 — Realizar inspección técnica
**Prioridad:** P0
Como técnico, quiero registrar el peritaje de la unidad devuelta, evaluando su condición y métrica final, para determinar si el equipo está apto o presenta averías.

### EQ-009 — Registrar daño y mantenimiento (Bloqueo)
**Prioridad:** P1
Como técnico, quiero asentar el detalle de daños o mantenimientos sobre una unidad para bloquear automáticamente su disponibilidad futura hasta que sea reparada, afectando la liquidación del depósito si el daño es imputable al cliente.

### EQ-010 — Registrar excepciones operativas (Auditoría)
**Prioridad:** P1
Como supervisor, quiero que toda autorización excepcional o cambio crítico quede registrado en una bitácora inmutable para preservar la trazabilidad de las decisiones.

### EQ-011 — Consultar dashboard
**Prioridad:** P1
Como supervisor, quiero visualizar indicadores de ocupación, estado en tiempo real de las unidades y reservas activas para tener visibilidad y control sobre la operación global.
