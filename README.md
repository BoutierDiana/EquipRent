# EquipRent
Sistema académico full-stack para la gestión integral de alquiler de herramientas, maquinaria ligera y equipos audiovisuales.

## 1. Problema
Actualmente, el control manual de activos genera riesgos operativos graves: sobreventa o superposición de fechas para un mismo equipo, pérdida de trazabilidad sobre la condición física de cada unidad, dificultades para liquidar depósitos de garantía y falta de historial sobre mantenimientos, siniestros y daños.

## 2. Objetivo del MVP
Construir un sistema web y móvil que permita administrar el catálogo de equipos y sus unidades físicas individuales; registrar clientes; calcular la disponibilidad dinámica por rango de fechas; gestionar reservas y evitar conflictos; controlar las entregas y devoluciones; registrar peritajes técnicos, daños y bloqueos por mantenimiento; y mostrar métricas de utilización.

## 3. Actores principales
- Administrador
- Operador
- Técnico
- Cliente
- Supervisor

## 4. Alcance inicial
- Clientes, catálogo de equipos y unidades físicas (identificador y métricas de uso).
- Tarifas y cálculo dinámico de disponibilidad temporal.
- Reservas y prevención de conflictos (solapamientos).
- Entregas (despacho) y devoluciones (retorno).
- Inspecciones técnicas, registro de daños y bloqueos por mantenimiento.
- Gestión operativa de depósitos de garantía.
- Dashboard, indicadores de utilización y bitácora de auditoría inmutable.

## 5. Fuera de alcance
- Pasarelas de pago bancarias reales (procesamiento con tarjetas).
- Facturación fiscal o contabilidad electrónica real.
- Seguimiento por GPS en tiempo real de la maquinaria alquilada.
- Sensores IoT para lectura automática de horómetros/odómetros en los equipos.
- Firmas electrónicas certificadas o validación biométrica.
- Algoritmos de IA para calcular precios dinámicos.

## 6. Stack objetivo del semestre
- Backend: Java 21 + Spring Boot
- Base de datos: PostgreSQL + Flyway
- Web: React + TypeScript
- Móvil: React Native + TypeScript
- Pruebas API: Postman
- Contenedores: Docker / Docker Compose
- Versionado: Git + GitHub
- CI: GitHub Actions
- IA: Spring AI, únicamente como capacidad complementaria

## 7. Estado actual
Clase 01: comprensión del problema, análisis de la ficha del proyecto, modelado conceptual del dominio y definición del alcance (v0.1). Todavía no existe código de aplicación ni base de datos física.

## 8. Documentación
- `docs/01-vision/vision-v0.1.md`
- `docs/01-vision/glossary-v0.1.md`
- `docs/02-requirements/backlog-v0.1.md`
- `docs/03-decisions/`

## 9. Regla de trabajo
Cada cambio importante debe ser comprensible, trazable y defendible. El repositorio es la fuente de verdad del proyecto.
