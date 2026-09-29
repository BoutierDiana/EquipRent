# Visión v0.1 — EquipRent

## 1. Contexto
Una empresa dedicada al alquiler de herramientas, equipos audiovisuales y maquinaria ligera necesita reemplazar controles manuales dispersos por una plataforma unificada para el control de su inventario y operaciones.

## 2. Problema
La operación manual actual genera riesgos graves de sobreventa de unidades físicas (solapamiento de fechas), pérdida de trazabilidad sobre la condición y desgaste de cada equipo, dificultad para conciliar y liquidar depósitos de garantía, y escasa visibilidad del historial de daños y mantenimientos.

## 3. Objetivo
Centralizar la operación de alquiler manteniendo una representación estricta y confiable del catálogo, unidades físicas individualizadas, disponibilidad temporal dinámica, reservas, entregas, devoluciones, inspecciones técnicas e historial de mantenimiento.

## 4. Actores

### Administrador
Configura el catálogo de equipos, unidades físicas, tarifas, usuarios del sistema y políticas globales.

### Operador
Registra clientes, consulta disponibilidad, crea y gestiona reservas, y registra operativa de entregas y devoluciones.

### Cliente / conductor
Consulta el catálogo, verifica disponibilidad, visualiza sus reservas activas y el estado de sus retiros/devoluciones desde el móvil.

### Técnico
Realiza inspecciones físicas de las unidades al retorno, evalúa condiciones operativas y registra daños o bloqueos por mantenimiento preventivo/correctivo.

### Supervisor
Autoriza excepciones operativas (ej. entregas sin reserva previa) y consulta indicadores de utilización en el dashboard.

## 5. Alcance del MVP
1. Gestión de clientes, catálogo, unidades físicas y tarifas.
2. Consulta dinámica de disponibilidad por rango de fechas.
3. Creación y gestión de reservas con validación anti-solapamiento.
4. Registro de entregas (despacho físico).
5. Registro de devoluciones e inspecciones técnicas obligatorias.
6. Gestión de daños y bloqueos por mantenimiento.
7. Registro y liquidación operativa de depósitos de garantía.
8. Historial de activos y bitácora de auditoría inmutable para excepciones.
9. Dashboard operativo y métricas de utilización.

## 6. Exclusiones
No incluye pasarelas de pago bancarias reales, facturación fiscal, seguimiento por GPS en tiempo real de la maquinaria, sensores IoT para lectura automática de odómetros/horómetros ni IA para calcular precios o autorizar reservas de manera autónoma.

## 7. Éxito inicial del proyecto
El proyecto será exitoso cuando pueda demostrar, con datos persistidos, el flujo crítico de extremo a extremo: desde el registro del cliente y consulta de disponibilidad, la reserva sin solapamiento, la entrega física, hasta la devolución con inspección técnica que evalúe si la unidad vuelve a estar disponible o pasa a mantenimiento. Todo consumido por web y móvil sobre un mismo backend.
