# equiprent-frontend — Guías 01 a 05

Frontend React + TypeScript + Vite de **EquipRent (Proyecto 15)**, consumiendo `equiprent-backend`.

**Traducción del ejemplo del profesor a tu proyecto:**

| ParkFlow360 | EquipRent |
|---|---|
| `parkflow360-frontend` | `equiprent-frontend` |
| features/clientes (padre) | features/**equipos** (padre) |
| features/vehiculos (hija) | features/**unidades** (hija) |
| `Cliente.ts` / `Vehiculo.ts` | `Equipo.ts` / `UnidadEquipo.ts` |
| `clienteId` en Vehiculo | `equipoId` en UnidadEquipo |
| `/clientes` y `/vehiculos` | `/equipos` y `/unidades` |
| `/api/clientes` | `/api/equipos`, `/api/unidades` |

## Cómo ejecutarlo

1. Abre la carpeta `equiprent-frontend` en WebStorm (File > Open).
2. Terminal (Alt+F12): `npm install`
3. Copia `.env.example` como `.env.development` (ya viene creado) y revisa la URL.
4. `npm run dev` → abre la URL que muestra Vite (normalmente http://localhost:5173).

**Para que los datos aparezcan** necesitas, en este orden:
- PostgreSQL con `V1` y `V2` ejecutados.
- `equiprent-backend` corriendo en el 8080.
- El archivo `backend/WebConfig.java` de este proyecto copiado a
  `equiprent-backend/src/main/java/com/equiprent/shared/web/WebConfig.java` (CORS).

Sin CORS verás las páginas pero con error: el navegador bloquea la petición aunque Postman funcione.

## Qué cubre cada guía

**Guía 01 — Estructura.** Proyecto Vite React+TS, `App.tsx` movido a `src/app/`, carpetas por feature, `.env.example`, `.gitignore` con `node_modules/` y `dist/`.

**Guía 02 — Routing y layout.** `BrowserRouter` en `main.tsx`, `AppRouter.tsx` con rutas `/`, `/equipos`, `/unidades`, `/acerca` y `*`, `MainLayout` con `Outlet`, `Sidebar` con `NavLink` e `isActive`, `Header`, `NotFoundPage`.

**Guía 03 — Modelos, mocks y tablas.** `Equipo.ts` y `UnidadEquipo.ts` (con el tipo `EstadoUnidad`), `equipos.mock.ts` y `unidades.mock.ts`, `EquipoTable` y `UnidadTable` con `map()`, `key` y estado vacío. `UnidadTable` usa `find()` para convertir `equipoId` en el nombre del equipo: ahí se ve la relación 1:N.

**Guía 04 — Formularios.** `EquipoFormData` y `UnidadFormData` (todo `string`, porque el input entrega texto), validación manual en `utils/`, `EquipoForm` y `UnidadForm` con inputs controlados, `useState` inmutable y select de `equipoId`.

**Guía 05 — Conexión HTTP.** `api/apiClient.ts` con `apiFetch` y `ApiError`, services por feature, `.env.development` con `VITE_API_URL`, GET con `loading`/`error`/`AbortController`, POST desde los formularios con `submitting` y `onCreated`, y `WebConfig.java` para CORS.

## Estructura

```
src/
├── api/apiClient.ts
├── app/App.tsx
├── components/common/     Header.tsx · Sidebar.tsx
├── features/
│   ├── equipos/           models · data · components · types · utils · services · pages
│   └── unidades/          models · data · components · types · utils · services · pages
├── layouts/MainLayout.tsx
├── pages/                 DashboardPage · AcercaPage · NotFoundPage
├── routes/AppRouter.tsx
└── styles/                global.css · forms.css
```

## Contrato real que consume (verifícalo en tu backend)

| Método | Ruta | Usado por |
|---|---|---|
| GET | `/api/equipos` (y `?nombre=`) | `EquiposPage` |
| POST | `/api/equipos` | `EquipoForm` |
| GET | `/api/unidades/{id}` | `unidadService.obtener` |
| GET | `/api/unidades/equipo/{equipoId}` | `UnidadesPage` |
| POST | `/api/unidades` | `UnidadForm` |

El JSON que envía `EquipoForm` coincide con `CrearEquipoRequest`; el de `UnidadForm`, con `CrearUnidadEquipoRequest`. Si cambias un DTO en el backend, actualiza el `types/` correspondiente.

## Prácticas obligatorias ya resueltas
- Guía 02: página `/acerca` creada y agregada al menú.
- Guía 03: un mock con `equipoId: 999` que muestra "Sin equipo asociado".
- Guía 04: botón Limpiar en ambos formularios, código en mayúsculas dentro del payload, y en el select sólo aparecen equipos activos.
- Guía 05: `loading`, `error`, botón deshabilitado mientras envía y la tabla se actualiza con el objeto que devuelve el backend.

## Respuestas de defensa

- **¿Qué es una SPA?** El navegador carga la aplicación una vez y el router decide qué componente mostrar según la URL, sin pedir un HTML nuevo por pantalla.
- **¿Qué hace `Outlet`?** Es el punto variable del layout: Sidebar y Header quedan fijos y ahí dentro se renderiza la página de la ruta activa. Si lo borras, el menú sigue pero el contenido desaparece.
- **`Link` vs `NavLink`.** `NavLink` además sabe si su ruta está activa y expone `isActive` para marcar la opción del menú.
- **¿Por qué no `<a href>`?** Un ancla normal recarga toda la aplicación y pierde el estado; `NavLink` sólo cambia la URL y el router reemplaza la vista.
- **Entidad JPA vs interface TypeScript.** La entidad representa persistencia en el backend y puede tener `@Entity`, `@ManyToOne`, timestamps. La interface sólo describe la forma del JSON para que el compilador me avise antes de ejecutar. No crea ninguna tabla.
- **¿Por qué `equipoId` es `string` en el formulario y `number` en el modelo?** Porque el navegador entrega el valor del `select` como texto. Se valida y se convierte al construir el payload.
- **¿Cómo representa el frontend la relación 1:N?** El select muestra el nombre del equipo pero guarda su `id`; ese `id` viaja como `equipoId`. La relación no se crea en React: la valida y persiste el backend contra la FK.
- **¿Por qué la validación del frontend no reemplaza la del backend?** Cualquiera puede llamar a la API con Postman o un script. El frontend evita viajes innecesarios y mejora la experiencia; las reglas reales viven en el servicio y en las constraints de PostgreSQL.
- **¿Por qué `fetch` necesita `response.ok`?** Porque no lanza excepción ante un 404 o un 409: la Promise se resuelve igual y hay que revisar el status a mano. Eso está centralizado en `apiFetch`.
- **¿Qué hace `AbortController`?** Cancela la petición si el componente se desmonta antes de que llegue la respuesta, evitando actualizar estado de un componente que ya no existe.
- **¿Por qué la tabla usa la respuesta del POST?** Porque el backend asigna el `id` definitivo; inventar uno en el navegador crearía datos falsos.
- **¿Puede `VITE_API_URL` guardar una contraseña?** No. Toda variable `VITE_` termina en el bundle y es visible para el usuario. Sirve para URLs públicas.

## Diagnóstico rápido

| Síntoma | Qué revisar |
|---|---|
| No aparece ninguna petición en Network | El problema está antes de `fetch`: evento, ruta o código |
| Error de CORS | `WebConfig.java` copiado y puerto de Vite igual al de `allowedOrigins` |
| 404 | Compara el endpoint con `requests.http` del backend |
| 400 | Compara el JSON enviado con el record del Controller |
| 409 | Código repetido: es el UNIQUE del backend haciendo su trabajo |
| Failed to fetch | El backend no está corriendo o la URL del `.env` está mal |
