# Decisiones de integridad v0.1 — EquipRent (Clase 04)

| RN/RF | Regla | Protección prevista | Justificación |
|---|---|---|---|
| RN-01 | Unidad con identificador único y estado | UQ codigo_unidad + NN + CHECK estado | Regla de una sola fila / columna |
| RN-02 | Unidad sin reservas solapadas | Backend transaccional (consulta por rango + bloqueo) | Depende de varias filas |
| RN-03 | Disponibilidad por rango | CHECK fecha_fin > fecha_inicio + consulta | El rango se valida en la fila; la disponibilidad se calcula |
| RN-04 | Reserva ≠ entrega | Tabla entrega separada; UQ entrega.reserva_id | Estructural |
| RN-05 | Entrega requiere reserva confirmada o autorización | Backend (estado) + CHECK autorización ⇒ autorizado_por | Mezcla de estado previo y fila |
| RN-06 | Devolución registra condición | NN inspeccion.condicion + CHECK | Una fila |
| RN-07 | Daño puede bloquear la unidad | Backend: si bloquea_unidad ⇒ estado BLOQUEADA en la misma transacción | Afecta dos tablas |
| RN-08 | Depósito operativo | CHECK monto > 0, método en dominio | Una fila |
| RN-09 | Cancelada libera disponibilidad | Consulta de solapes ignora CANCELADA + CHECK motivo | Transaccional + fila |
| RN-10 | Historial no se elimina | Trigger BEFORE DELETE + FK sin CASCADE | Protección en BD |
| RF-01 | Código de equipo único | UQ equipo.codigo | — |
| RF-04 | Cliente no duplicado | UQ cliente.numero_documento | — |

## Prueba de contradicción
| Regla | Estado inválido posible | Protección |
|---|---|---|
| RN-01 | Dos unidades con código "UN-TAL-001-01" | uq_unidad_equipo_codigo |
| RN-02 | UN-PRO-001-01 reservada 01–03/oct por dos clientes | Servicio de reservas: consulta de solape antes de insertar |
| RN-05 | Entrega marcada como excepcional sin supervisor | ck_entrega_autorizacion |
| RN-10 | DELETE sobre historial de una unidad | trg_historial_no_delete |
