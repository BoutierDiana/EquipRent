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
- **Parte 1 (modelado y base de datos, Clases 01–08):** visión, backlog, modelos conceptual/relacional, DER, diccionario, diseño físico, migraciones Flyway V1–V4 y consultas JOIN.
- **Backend Spring Boot:** CRUD completo de la relación principal `UnidadEquipo 1:N Mantenimiento`, errores 400/404/409 uniformes, Swagger y tests.
- **Parte 2 (frontend web, Guías 01–10):** React + TypeScript + Vite con CRUD 1:N, búsqueda, filtros, paginación, Dashboard, tests con Vitest y build de producción.
- **Parte 3 (móvil, React Native + Expo):** en desarrollo.

## 8. Estructura oficial del repositorio

| Carpeta | Contenido |
|---|---|
| `docs/01-vision`, `docs/02-requirements`, `docs/03-decisions` | Visión, glosario, backlog y decisiones (ADR) |
| `docs/04-model`, `docs/5-database` | Modelos conceptual y relacional, DER, diccionario, diseño físico |
| `docs/6-postgresql`, `docs/7-dml` | Evidencias de Clase 06 y 07 (pruebas de integridad, consultas DML) |
| `docs/equiprent-backend` | **Backend oficial** Spring Boot; migraciones en `src/main/resources/db/migration`, JOINs en `db/queries` |
| `equiprent-frontend` | **Frontend web oficial** React + TypeScript + Vite |

Carpetas de versiones anteriores, conservadas solo como historial y **no** usadas por la aplicación: `EquipRent_Frontend_Guias_01_a_05/`, `EquipRent_Proyecto_Completo/`, `prueba.txt`, `HELP.md`.

Documentación clave:
- `docs/01-vision/vision-v0.1.md`
- `docs/01-vision/glossary-v0.1.md`
- `docs/02-requirements/backlog-v0.1.md`
- `docs/03-decisions/` (ADR-001 contrato y catálogos, ADR-002 Flyway)
- `docs/equiprent-backend/README.md` y `equiprent-frontend/README.md`

## 9. Regla de trabajo
Cada cambio importante debe ser comprensible, trazable y defendible. El repositorio es la fuente de verdad del proyecto.
