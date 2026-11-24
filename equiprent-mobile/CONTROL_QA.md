# Control de calidad — EquipRent Mobile (Guía 14)

Relación evaluada: **UnidadEquipo 1:N Mantenimiento**, contra Spring Boot + PostgreSQL.

## 1. Niveles de prueba

| Nivel | Qué cubre | Herramienta | Dónde |
|---|---|---|---|
| Unitario (móvil) | Validaciones, reglas 1:N, reducer, mappers DTO, detección de conflictos offline | Vitest | `equiprent-mobile/tests/*.test.ts` |
| Integración simulada (móvil) | `apiClient`: status HTTP, ApiError, red caída, tiempo límite, Bearer, 401, multipart | Vitest + `fetch` falso | `tests/apiClient.test.ts` |
| Unitario e integración (backend) | Servicios, controladores con MockMvc, JWT y subida de fotos | JUnit 5 + Spring Boot Test | `docs/equiprent-backend/src/test` |
| End-to-end manual | Emulador → REST → PostgreSQL, con evidencias | Android Emulator | Sección 4 de este documento |
| Seguridad | Sin token o token falso → 401; credenciales malas → 401; archivo falso → 400 | JUnit + manual | `SeguridadJwtTest`, `FotoEvidenciaControllerTest` y la sección 4 |

Vitest **no** reemplaza las pruebas en el emulador. SecureStore, SQLite, la cámara y los permisos son nativos y se prueban a mano.

## 2. Secuencia mínima reproducible

```bash
# Móvil (carpeta equiprent-mobile)
npm run typecheck        # tsc --noEmit: 0 errores
npm test                 # vitest run: 81 pruebas aprobadas
npm run qa               # las dos anteriores en orden
npx expo-doctor          # registrar advertencias (ver sección 5)

# Backend (carpeta docs/equiprent-backend)
./mvnw -q -B test        # 35 pruebas aprobadas
```

Después se arrancan PostgreSQL (puerto 5433) y Spring Boot (8080). La seguridad se activa con `EQUIPRENT_AUTH_REQUIRED=true` y la app se abre con `npx expo start -c`.

## 3. Resultado de la última ejecución

| Fecha | `tsc` | Vitest | JUnit | expo-doctor | Responsable |
|---|---|---|---|---|---|
| 2026-11-24 | 0 errores | 81/81 | 35/35 | 21/22 (ver 5) | |

**Comprobación de que las pruebas detectan fallos:** se cambió a propósito la regla `egreso >= ingreso` por `egreso > ingreso`. La prueba «acepta egreso el MISMO día del ingreso» falló, y luego se restauró el código.

## 4. Casos end-to-end manuales

Cada caso registra: ID, precondición, pasos, resultado esperado, resultado obtenido, captura y corrección.

| ID | Precondición | Pasos | Resultado esperado |
|---|---|---|---|
| E2E-01 | Backend encendido | Diagnóstico → Probar conexión | `/api/health` 200, se muestra la URL usada |
| E2E-02 | Sesión iniciada | Crear una unidad remota con serie nueva | 201; aparece en la lista y en PostgreSQL con el mismo ID |
| E2E-03 | La unidad de E2E-02 existe | Crear otra unidad con la MISMA serie | 409 «Conflicto», se mantiene el formulario |
| E2E-04 | — | Unidad con serie de 3 caracteres | Error local antes de enviar (no hay petición) |
| E2E-05 | Unidad existente | Crear dos órdenes con el mismo `unidadEquipoId` | Ambas aparecen en la ficha de la unidad (1:N) |
| E2E-06 | — | Orden con egreso anterior al ingreso | Error local; si se fuerza en Swagger, el backend responde 400 |
| E2E-07 | La unidad tiene órdenes | Eliminar la unidad | 409; la unidad NO se borra |
| E2E-08 | Backend APAGADO | Abrir la lista remota | «Fallo de conexión…», **nunca** «no existe la unidad» |
| E2E-09 | `AUTH_REQUIRED=true` | Abrir `/remoto` sin sesión | Redirige a Login |
| E2E-10 | `AUTH_REQUIRED=true` | Login con clave incorrecta | 401 «Usuario o contraseña incorrectos» |
| E2E-11 | Sesión iniciada | Reiniciar el backend con otro `EQUIPRENT_JWT_SECRET` y recargar | 401 → la sesión se cierra sola, aviso «Tu sesión expiró» |
| E2E-12 | Caché descargado | Modo avión → cerrar y reabrir → Modo sin conexión | La lista se sigue viendo desde SQLite |
| E2E-13 | Sin red | Editar una unidad → Guardar | Etiqueta PENDIENTE; nada llega al servidor |
| E2E-14 | Pendiente y red de nuevo | Sincronizar | «1 cambio(s) aplicados»; se ve en el CRUD REST |
| E2E-15 | Pendiente, y la misma unidad cambiada desde la web | Sincronizar | CONFLICTO; el servidor conserva el cambio de la web |
| E2E-16 | — | Fotos → Tomar foto (primera vez) | El permiso de cámara se pide SOLO en este momento |
| E2E-17 | Permiso de cámara negado | Tomar foto | Mensaje claro; la galería sigue funcionando |
| E2E-18 | Imagen JPEG en la galería | Subir a una orden | 201; aparece la miniatura; el archivo está en `archivos-dev/mantenimientos/{id}/` |
| E2E-19 | — | Subir un archivo de 6 MB (Swagger o curl) | 413 «supera el tamaño máximo» |

## 5. Advertencias conocidas

- **expo-doctor: Hermes V1 en Expo SDK 56.** Tiene una regresión de memoria conocida. Se corrige actualizando a Expo SDK 57 (`npx expo install expo@^57.0.9 --fix`). Está pendiente porque esa actualización cambia todas las dependencias nativas y necesita su propia rama y una prueba completa.
- **Corregido en esta guía: `expo-font` duplicado (56 y 58).** Entró como dependencia indirecta y quedó fijado en `~56.0.7`, la versión del SDK.
- **`npm install` sin `--force` falla por un conflicto de dependencias** que ya existía (`react-dom@19.3.1` pide `react@^19.3.1` y la app usa `19.2.3`). **No usar `--legacy-peer-deps`:** borra del lockfile dependencias necesarias como `react-dom` y `reanimated`.

## 6. Reglas para las evidencias

- **Nunca** subir a capturas ni a GitHub tokens JWT, contraseñas, `.env.local` ni las fotos de `archivos-dev/`.
- Usar solo datos de prueba ficticios, sin datos personales reales.
- Si una prueba falla, registrar la causa, la corrección y el commit que la resuelve.
