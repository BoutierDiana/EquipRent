# Decisiones de Integridad v0.1 — EquipRent

## 1. Matriz de Trazabilidad: Reglas vs. Protección Prevista

| RN / RF | Regla de Negocio / Requisito | Protección Prevista | Justificación Técnica |
|---|---|---|---|
| **RN-01 / RF-02** | Cada unidad física posee un identificador único e irrepetible. | `UQ` en `unidad_equipo.numero_serie` + `NN` | Evita registrar dos herramientas físicas con el mismo número de serie o placa patrimonial. |
| **RN-02 / RN-03 / RF-07** | No solapamiento: una unidad no puede reservarse en rangos de fechas cruzados. | Backend transaccional con índices GiST / Exclusión temporal + Bloqueo pesimista | Un `UNIQUE` simple no puede evaluar rangos continuos de fechas solapadas. Requiere validación de servicio con índices temporales en PostgreSQL. |
| **RN-04 / RN-05 / RF-09** | Toda entrega exige una reserva confirmada previa y no equivale a la reserva. | `FK` `entrega.reserva_id` con `NN` + `UQ` (1:1) + Backend | Se separa físicamente la tabla `reserva` de `entrega`. El `UQ` impide que una misma reserva sea entregada más de una vez. |
| **RN-06 / RF-12** | Toda devolución exige obligatoriamente registrar condición técnica mediante inspección. | `FK` `inspeccion.devolucion_id` con `NN` + `UQ` (1:1) + Transición de estado en Backend | No se permite cerrar una devolución sin instanciar la fila correspondiente en `inspeccion`. |
| **RN-07 / RF-14** | La detección de un daño bloquea la unidad para nuevas reservas (envío a taller). | `FK` `mantenimiento.unidad_equipo_id` + Backend / Trigger de actualización de estado | Si `inspeccion.resultado = 'DANADO'`, se cambia `unidad_equipo.estado_operativo = 'EN_MANTENIMIENTO'` y se crea la orden de taller. |
| **RN-08 / RF-10** | Depósito en garantía vinculado a la reserva con control estricto de liquidación. | `FK` `deposito.reserva_id` (`UQ`, `NN`) + Restricciones `CHECK` (`monto_recibido >= monto_retenido_danos + monto_devuelto`) | Garantiza que no se retenga ni se devuelva más dinero del que fue efectivamente recibido como garantía. |
| **RN-09 / RF-08** | La cancelación formal de una reserva libera inmediatamente las unidades. | Transición controlada de estado en Backend (`reserva.estado = 'CANCELADA'`) | Las consultas dinámicas de disponibilidad filtran `reserva.estado != 'CANCELADA'`, liberando el activo de inmediato sin borrar el registro histórico. |
| **RN-10 / RF-18** | El historial operativo y de eventos no puede ser eliminado (inmutabilidad). | Prohibición de `DELETE` en BD (permisos de usuario) + tabla inmutable `auditoria_excepcion` | Todo evento queda preservado para auditoría; las anulaciones solo operan mediante cambios de estado. |

---

## 2. Ejercicio Obligatorio: Prueba de Contradicción

A continuación se analizan 3 escenarios de datos inválidos y cómo el diseño evita la corrupción del sistema:

### Caso 1: Doble despacho de una misma reserva
- **Regla analizada:** RN-05 (Separación y unicidad de entrega).
- **Estado inválido posible:** Un operador despacha la reserva `RES-001` por la mañana y otro operador, por error de coordinación, vuelve a registrar una salida física para la misma reserva `RES-001` por la tarde.
- **Protección prevista:** Restricción `UNIQUE` en la columna `entrega.reserva_id`. La base de datos rechazará el segundo intento con error de clave duplicada.

### Caso 2: Liquidación fraudulenta o errónea de garantía
- **Regla analizada:** RN-08 (Naturaleza y consistencia del depósito).
- **Estado inválido posible:** Se recibe un depósito de $100, pero al devolverlo el operador ingresa por error una devolución de $150, o descuenta $120 por daños sobre un depósito de $100.
- **Protección prevista:** Restricción `CHECK (monto_recibido >= monto_retenido_danos + monto_devuelto)`. La base de datos abortará la transacción si la suma de descuentos y reintegros supera el capital depositado.

### Caso 3: Registro de peritaje huérfano sin devolución física
- **Regla analizada:** RN-06 (Control de retorno e inspección técnica).
- **Estado inválido posible:** Un técnico intenta emitir un dictamen de daño e inspección sobre una herramienta que aún está en manos del cliente (sin haber ingresado físicamente al almacén).
- **Protección prevista:** Clave foránea `inspeccion.devolucion_id` marcada como `NOT NULL` hacia una `devolucion_id` existente y válida. Es físicamente imposible crear una inspección sin que exista previamente el acta de devolución.