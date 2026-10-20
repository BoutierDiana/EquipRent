# EquipRent — Frontend Web (React + TypeScript + Vite)

SPA que consume la API Spring Boot de EquipRent y gestiona la relación principal **UnidadEquipo 1:N Mantenimiento**.
Estética Cyber-Industrial con CSS puro (`styles/tokens.css`, `index.css`, `styles/ui.css`).

## Puesta en marcha

```bash
npm install
cp .env.example .env.development   # solo si no existe; ajustar VITE_API_URL
npm run dev                        # http://localhost:5173
```

El backend debe estar en `http://localhost:8080` (ver `docs/equiprent-backend/README.md`). El indicador **Online Node** del encabezado consulta `GET /api/health` cada 30 s.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en caliente |
| `npm run test` | Vitest en modo observación |
| `npm run test:run` | Ejecuta los tests una vez (usar antes de entregar) |
| `npm run build` | `tsc -b` (sin errores de tipos) + bundle de producción en `dist/` |
| `npm run preview` | Sirve `dist/` en `http://localhost:4173` para probar el build |
| `npm run lint` | Oxlint |

Secuencia de calidad antes de entregar: `npm run test:run` → `npm run build` → `npm run preview`.

## Variables de entorno

| Archivo | Cuándo lo usa Vite | `VITE_API_URL` |
|---|---|---|
| `.env.development` | `npm run dev` | `http://localhost:8080/api` |
| `.env.production` | `npm run build` / `preview` | URL pública del backend (hoy, la local) |
| `.env.example` | Plantilla versionada | — |

Todo `VITE_*` termina dentro del JavaScript del navegador: nunca guardar secretos.

## Estructura

```
src/
├── api/apiClient.ts          fetch + response.ok + ApiError legible (message y fieldErrors del backend)
├── app/                      App y AppErrorBoundary (errores de render)
├── routes/AppRouter.tsx      / · /unidades · /mantenimientos · /acerca · 404
├── layouts/MainLayout.tsx    Sidebar + Header + <Outlet />
├── components/
│   ├── common/               Sidebar, Header (Online Node)
│   └── ui/                   Button, Modal, ConfirmDialog, SearchInput, SelectFilter,
│                             Pagination, StatusBadge, MetricCard, EmptyState, Icon (SVG)
├── features/
│   ├── UnidadEquipo/         models · types · services · hooks · utils · components · pages
│   ├── Mantenimiento/        ídem (entidad hija: unidadEquipoId)
│   └── Dashboard/            métricas derivadas de ambas colecciones
├── shared/                   useAsyncList (AbortController), isAbortError, fechas
└── styles/                   tokens.css, ui.css
```

Flujo de datos: Page → hook (`useUnidadesEquipo`, `useMantenimientos`) → service → `apiFetch` → Spring Boot → JSON → `setData` → render.

## Contratos (ADR-001)

Los tipos de `features/*/models` reflejan los DTO del backend (no las entidades JPA):

| Interfaz | Campos |
|---|---|
| `UnidadEquipo` | `id`, `equipoId`, `numeroSerie`, `estadoOperativo`, `metricaUsoAcumulada`, `notasEstado`, `activo`, `createdAt` |
| `Mantenimiento` | `id`, `unidadEquipoId`, `danoId`, `tipo`, `fechaIngreso`, `fechaEgresoEstimada`, `fechaEgresoReal`, `estado`, `createdAt` |

Catálogos: `estadoOperativo` ∈ DISPONIBLE · RESERVADA · EN_USO · EN_MANTENIMIENTO · DE_BAJA; `tipo` ∈ PREVENTIVO · CORRECTIVO; `estado` ∈ EN_PROCESO · COMPLETADO · CANCELADO.

## Tests (Vitest + React Testing Library)

| Archivo | Nivel |
|---|---|
| `StatusBadge.test.tsx`, `MetricCard.test.tsx` | Componente presentacional |
| `Pagination.test.tsx`, `SearchInput.test.tsx` | Interacción con `user-event` |
| `UnidadEquipoTable.test.tsx` | Tabla CRUD: filas, eventos Editar/Eliminar, estado vacío |
| `unidadEquipoValidation.test.ts`, `mantenimientoValidation.test.ts` | Funciones puras de validación (incluye la referencia al padre 1:N) |
| `apiClient.test.ts` | `response.ok`, 204, 409 y 400 con `fieldErrors`, fallo de red |
| `dates.test.ts` | Conversión `datetime-local` ↔ ISO-8601 |

## Despliegue: fallback SPA

Con `BrowserRouter`, recargar `/unidades` en un hosting estático debe devolver `index.html`.

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Netlify: archivo `public/_redirects` con `/* /index.html 200`. En el backend, `CORS_ALLOWED_ORIGINS` debe incluir el dominio real del frontend.

## Matriz de pruebas Fullstack (Guía 10)

| ID | Prueba | Esperado | Resultado |
|---|---|---|---|
| F01 | Abrir Dashboard | 6 métricas y próximas salidas de taller | |
| F02 | Crear unidad válida | 201 y fila visible | |
| F03 | Crear unidad con serie de 3 caracteres | Error junto al campo, sin request | |
| F04 | Editar estado y métrica de una unidad | PUT 200, fila actualizada | |
| F05 | Crear orden para una unidad | POST 201, `unidad_equipo_id` correcto | |
| F06 | Reasignar una orden a otra unidad | PUT 200, cambia `unidad_equipo_id` | |
| F07 | Filtrar órdenes por maquinaria | GET `/mantenimientos/unidad-equipo/{id}` | |
| F08 | Buscar y paginar | La búsqueda actúa antes de paginar | |
| F09 | Eliminar orden | Desaparece tras el 204 | |
| F10 | Eliminar unidad con órdenes | 409, la fila se conserva con el mensaje | |
| F11 | Recargar `/unidades` en `npm run preview` | La SPA mantiene la ruta | |
| F12 | Apagar el backend | Offline Node y mensaje de conexión | |
