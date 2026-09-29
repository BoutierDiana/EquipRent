# Plan de Migración V1 — EquipRent (Clase 05)

## Objetivo
Representar el catálogo, las unidades físicas, clientes, reservas con detalle, entregas, devoluciones, inspecciones, daños, mantenimiento, depósitos y trazabilidad.

## Tablas incluidas y orden (por dependencias)
1. usuario (raíz)
2. rol (raíz)
3. usuario_rol (depende de usuario, rol)
4. cliente (depende de usuario)
5. categoria_equipo (raíz)
6. equipo (depende de categoria_equipo)
7. unidad_equipo (depende de equipo)
8. tarifa (depende de equipo)
9. reserva (depende de cliente, usuario)
10. reserva_detalle (depende de reserva, unidad_equipo, tarifa)
11. entrega (depende de reserva, usuario)
12. deposito (depende de reserva, usuario)
13. devolucion (depende de reserva, usuario)
14. inspeccion (depende de devolucion, unidad_equipo, usuario)
15. dano (depende de unidad_equipo, inspeccion, usuario)
16. mantenimiento (depende de unidad_equipo, dano, usuario)
17. historial_estado_unidad (depende de unidad_equipo, usuario)
18. auditoria (depende de usuario)

## Restricciones previstas
- PK: todas las tablas con `<tabla>_id` IDENTITY.
- FK: todas sin CASCADE (RN-10: nada se borra en cadena).
- NOT NULL: según diccionario.
- UNIQUE: codigo_unidad, numero_serie, equipo.codigo, numero_documento, reserva.codigo, (reserva_id, unidad_id), entrega.reserva_id, devolucion.reserva_id, (usuario_id, rol_id).
- CHECK: estados, montos, rangos de fechas, autorización excepcional, motivo de cancelación.

## Reglas que requerirán lógica posterior
- RN-02 solapes, RN-05 transición a entrega, RN-07 bloqueo por daño, transiciones de estado de unidad.

## Fuera de V1
- Autenticación real (JWT), Spring AI, índices de reporte avanzados.

## Criterio de salida
V1 ejecutado sin errores: 18 tablas en el schema `equiprent` y pruebas negativas fallando como se espera.
