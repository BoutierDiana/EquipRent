# EquipRent — Modelo relacional v0.1 (Clase 03)

## 1. Fuente
- Proyecto oficial: 15 · EquipRent
- Modelo conceptual base: model-conceptual-v0.1.md
- Flujo crítico: Operador registra cliente → consulta disponibilidad → reserva unidades → registra entrega → cliente consulta en móvil → técnico inspecciona → registra devolución y posible daño → unidad vuelve a disponible o mantenimiento.

## 2. Criterios de transformación
- 1:N → FK en el lado N.
- N:M → tabla puente (reserva_detalle, usuario_rol).
- PK técnica `<tabla>_id`; claves naturales como UNIQUE.
- Optionalidad registrada antes de NULL/NOT NULL.

## 3. Tablas candidatas núcleo
### cliente
Propósito: una persona u organización que alquila.
- cliente_id [PK] · numero_documento [UQ] · nombre_completo · email · telefono · direccion · activo · usuario_id [FK opcional]

### categoria_equipo
- categoria_id [PK] · codigo [UQ] · nombre · descripcion · activo

### equipo
Propósito: un tipo/modelo del catálogo.
- equipo_id [PK] · categoria_id [FK → categoria_equipo] · codigo [UQ] · nombre · marca · modelo · descripcion · activo

### unidad_equipo
Propósito: una copia física concreta.
- unidad_id [PK] · equipo_id [FK → equipo] · codigo_unidad [UQ] · numero_serie [UQ] · estado · fecha_adquisicion · valor_referencial · observacion

### tarifa
- tarifa_id [PK] · equipo_id [FK] · nombre · unidad_cobro · monto · deposito_sugerido · vigente_desde · vigente_hasta · activo

### reserva
- reserva_id [PK] · codigo [UQ] · cliente_id [FK] · fecha_inicio · fecha_fin · estado · motivo_cancelacion

### reserva_detalle (puente)
- reserva_detalle_id [PK] · reserva_id [FK] · unidad_id [FK] · tarifa_id [FK opc.] · precio_aplicado

### entrega / devolucion
- entrega_id [PK] · reserva_id [FK, UQ] · entregado_at · autorizacion_excepcional · autorizado_por
- devolucion_id [PK] · reserva_id [FK, UQ] · devuelto_at · observacion

## 4. Relaciones
- equipo 1:N unidad_equipo — RN-01, RF-02
- categoria_equipo 1:N equipo — RF-01
- cliente 1:N reserva — RF-06, RF-16
- reserva 1:0..1 entrega — RN-04, RF-09
- reserva 1:0..1 devolucion — RN-06, RF-11

## 5. Relaciones N:M
- reserva N:M unidad_equipo → **reserva_detalle** (atributo propio: precio_aplicado, tarifa_id)
- usuario N:M rol → **usuario_rol** (atributos propios: asignado_at, activo)

## 6. Claves naturales / UNIQUE candidatas
- unidad_equipo.codigo_unidad — RN-01 exige identificador único.
- unidad_equipo.numero_serie — el fabricante no repite series (nullable).
- equipo.codigo — código de catálogo.
- cliente.numero_documento — un cliente no se registra dos veces.
- (reserva_id, unidad_id) — la misma unidad no se repite en una reserva.
- entrega.reserva_id — como máximo una entrega por reserva.

## 7. Optionalidad
- unidad_equipo.equipo_id **obligatoria**: no existe unidad sin tipo.
- reserva.cliente_id **obligatoria**.
- reserva_detalle.tarifa_id **opcional**: el precio queda congelado aunque la tarifa cambie.
- cliente.usuario_id **opcional**: no todo cliente usa la app móvil.
- inspeccion.devolucion_id **opcional**: hay inspecciones preventivas.

## 8. Reglas iniciales de integridad
- fecha_fin > fecha_inicio.
- montos ≥ 0; depósito > 0.
- estado dentro de su conjunto permitido.

## 9. Decisiones pendientes
- ¿Solapamiento se protege también en BD (exclusion constraint)? Por ahora backend (ver decisiones-integridad).

## 10. Revisión de normalización
- Listas multivaluadas: "unidades reservadas" no se guarda como lista → reserva_detalle.
- Columnas repetitivas: se evitó unidad1/unidad2 en reserva.
- Redundancia: el nombre del equipo no se copia en unidad_equipo; se obtiene por la FK.
