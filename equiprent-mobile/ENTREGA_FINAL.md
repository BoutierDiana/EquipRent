# EquipRent Mobile — Entrega final (Guía 15)

## 1. Datos obligatorios

| Dato | Valor |
|---|---|
| Estudiante | _Diana Boutier Vaca_ |
| Proyecto | **EquipRent**: alquiler de herramientas, maquinaria ligera y equipos |
| Relación 1:N | **UnidadEquipo** (1) → **Mantenimiento** (N) — adapta Cliente → Vehículo de la guía |
| Repositorio | `BoutierDiana/EquipRent` |
| Rama y commit de entrega | `mobile/guia-15` · _(pegar `git rev-parse --short HEAD`)_ |
| Móvil | Expo SDK 56.0.24 · React Native 0.85.3 · React 19.2.3 · TypeScript 6.0 · expo-router (rutas tipadas) |
| Backend | Java 21 · Spring Boot 3.2.5 (hexagonal) · Spring Security + JWT HS256 · Flyway V1–V4 |
| Base de datos | PostgreSQL, puerto 5433, base `equiprent`, esquema `equiprent` |
| Node usado | _(pegar `node -v`)_ |
| Paquete Android | `bo.upsa.equiprent.mobile` (versión 1.0.0, versionCode 1) |
| APK de prueba | _(https://expo.dev/accounts/dianabou/projects/equiprent-mobile/builds/8fa594f3-e9d0-493b-87bd-95479d9e7d78)_ |
| Backend accesible en | _(ej. `http://192.168.0.15:8080/api` en la red del aula)_ |

## 2. Cómo se compila

### Requisitos previos (una sola vez)
```bash
npm install -g eas-cli          # o usar "npx eas-cli@latest" en cada comando
eas login                        # cuenta gratuita de expo.dev
eas init                         # vincula el proyecto y agrega extra.eas.projectId a la configuración
```

### Verificar antes de compilar
```powershell
cd equiprent-mobile
powershell -ExecutionPolicy Bypass -File .\scripts\verificar_entrega.ps1 -Backend
```

### URL del backend para el APK
EAS **no** lee `.env.local`. La URL se carga como variable del entorno `preview`:
```bash
eas env:create --environment preview --name EXPO_PUBLIC_API_URL --value http://<IP-de-tu-PC>:8080/api --visibility plaintext
```

### Perfiles de `eas.json`

| Perfil | Resultado | HTTP sin cifrar | Uso |
|---|---|---|---|
| `preview` | **APK** instalable | Permitido | Demostración en clase y en el teléfono |
| `production` | **AAB** (Android App Bundle) | **Bloqueado** | Google Play; exige backend HTTPS |
| `development` | APK interno | Permitido | Pruebas internas |

```bash
eas build --platform android --profile preview      # -> enlace para descargar el .apk
eas build --platform android --profile production   # -> .aab para Play Console
```

El bloqueo de HTTP por perfil está en `app.config.js` (`expo-build-properties` → `usesCleartextTraffic`). La pantalla **Diagnóstico** muestra la URL efectiva, la versión, el perfil y un aviso si se usa HTTP.

### Instalar el APK
- **Emulador:** arrastrar el `.apk` a la ventana del emulador.
- **Teléfono:** abrir el enlace de EAS y permitir «instalar apps desconocidas».
- **Backend:** debe escuchar en la IP de la PC (Spring Boot escucha en `0.0.0.0` por defecto). El Firewall de Windows debe permitir el puerto 8080 en la red privada.

## 3. Evidencias mínimas

| # | Evidencia | Dónde se ve | Caso QA |
|---|---|---|---|
| 1 | Pantallas locales de Unidad y Mantenimiento | Inicio → Catálogo de Unidades / Órdenes de Taller | — |
| 2 | CRUD REST de unidades y órdenes con la relación 1:N | Datos persistidos → CRUD REST; ficha de la unidad con sus órdenes | E2E-02, E2E-05 |
| 3 | Número de serie duplicado → 409 | Nueva Unidad (API) | E2E-03 |
| 4 | Unidad con órdenes no se elimina → 409 | Ficha remota → Eliminar | E2E-07 |
| 5 | GET exitoso y errores 400 / 401 / 404 / 409 | Diagnóstico, formularios, Swagger | E2E-01, 06, 10 |
| 6 | Login y logout, token en SecureStore | Login → barra de sesión → SALIR | E2E-09 a E2E-11 |
| 7 | Sin conexión y sincronización manual con conflicto | Modo sin conexión | E2E-12 a E2E-15 |
| 8 | Pruebas aprobadas y TypeScript sin errores | `npm run qa` (81 Vitest) · `./mvnw test` (35 JUnit) | Sección 3 de CONTROL_QA |
| 9 | Permiso de cámara, selección y subida controlada | Orden → Evidencia fotográfica | E2E-16 a E2E-19 |
| 10 | APK instalado y probado | Diagnóstico muestra `release · preview` | — |

**Capturas:** nunca deben mostrar el token JWT, la contraseña ni `.env.local`.

## 4. Guion para la defensa

Explícalo con tus palabras. Estos son los puntos técnicos que conviene mencionar y dónde está cada uno en el código.

**a) Flujo completo de una operación** (ejemplo: editar una unidad):
1. Pantalla `remoto/unidades/editar/[id].tsx`.
2. Validación local `validarUnidadRemota`.
3. Mapper `aActualizarRequest`.
4. `unidadesApi.actualizar` y `requestHttp`, que adjunta el Bearer.
5. HTTP `PUT /api/unidades-equipo/{id}`.
6. Filtro JWT de Spring Security.
7. `UnidadEquipoController` con `@Valid`.
8. Caso de uso `ActualizarUnidadEquipoUseCase` (servicio).
9. Puerto de salida y adaptador JPA.
10. Hibernate.
11. PostgreSQL, que vuelve a validar con sus CHECK y UNIQUE.
12. La respuesta (DTO o `ApiError`) regresa por el mismo camino.

**b) Por qué el móvil nunca se conecta directo a PostgreSQL:**
- Las credenciales de la base quedarían dentro del APK, y cualquiera puede extraerlas.
- Se saltarían las reglas de negocio y la validación del servidor.
- PostgreSQL no debe exponerse a Internet.
- El backend es el único punto de control: autentica, valida y registra.

**c) Dónde vive cada dato:**

| Lugar | Qué guarda | Duración |
|---|---|---|
| Memoria (`EquipRentContext`) | Laboratorio local (Guías 05–07) | Hasta cerrar la app |
| SecureStore (Android Keystore) | Solo el token JWT y el nombre de usuario | Hasta el logout |
| SQLite (`equiprent_offline.db`) | Caché de unidades y cola de cambios pendientes | Hasta volver a descargar o sincronizar |
| PostgreSQL (servidor) | **La verdad oficial** | Permanente |
| Disco del servidor (`archivos-dev/`) | Fotos de evidencia | Según la política del servidor |

**d) Cómo se evita que un token ajeno o falso modifique registros:**
- **Firma:** el token está firmado con HMAC-SHA256 y una clave que solo conoce el servidor. Si se altera un byte, la firma no coincide y el servidor responde 401.
- **Vencimiento:** el token expira a los 30 minutos (`exp`).
- **Rutas protegidas:** con `EQUIPRENT_AUTH_REQUIRED=true` todas las rutas, salvo health y login, exigen el token.
- **Lo que hace la app:** el token se guarda cifrado y nunca se guarda la contraseña. Si llega un 401, la sesión se cierra sola. El token solo se envía a `API_BASE_URL`.
- **Límite honesto:** hoy existe un único usuario demo con permisos `read write`. Con usuarios reales faltaría:
  - autorización por recurso: el servidor compara el `sub` del token con el dueño del registro y responde **403** si no coincide;
  - roles (Administrador, Técnico…);
  - HTTPS obligatorio.

**e) Decisiones que conviene defender:**
- **Sincronización manual con detección de conflictos**, en vez de "el último que guarda gana", para no pisar cambios de otros.
- **Fotos validadas por sus bytes reales (JPEG/PNG)**, no por la extensión, y con nombre generado por el servidor (UUID).
- **Perfil `production` sin HTTP.**

## 5. Límites conocidos (decirlos con honestidad)
- No se publicó en Google Play: requiere una cuenta de desarrollador, una política de privacidad y un backend HTTPS público.
- Hay un único usuario demo; no hay roles ni autorización por registro (403).
- Las fotos se guardan en una carpeta local del servidor: no hay almacenamiento en la nube, antivirus ni retención.
- Expo SDK 56 tiene una regresión de memoria conocida en Hermes. Se corrige actualizando al SDK 57 (CONTROL_QA, sección 5).
- Vitest no cubre lo nativo (SecureStore, SQLite, cámara); eso se probó a mano.

## 6. Historial por guía

| Guía | Rama | Tema |
|---|---|---|
| 01–04 | `mobile/guias-01-05` | Entorno, componentes, navegación, formularios |
| 05 | `mobile/guia-05` | Estado compartido (Context + useReducer) |
| 06 | `mobile/guia-06` | CRUD local completo 1:N |
| 07 | `mobile/guia-07` | Arquitectura por capas: dominio, contratos, adaptadores |
| 08 | `mobile/guia-08` | Cliente HTTP, URL configurable, diagnóstico |
| 09 | `mobile/guia-09` | CRUD REST de UnidadEquipo |
| 10 | `mobile/guia-10` | CRUD REST de Mantenimiento y relación 1:N persistida |
| 11 | `mobile/guia-11` | Login JWT en Spring Boot y sesión segura |
| 12 | `mobile/guia-12` | SQLite, modo sin conexión y conflictos |
| 13 | `mobile/guia-13` | Cámara, galería y subida de fotos multipart |
| 14 | `mobile/guia-14` | Pruebas Vitest y CONTROL_QA |
| 15 | `mobile/guia-15` | Compilación APK/AAB y entrega final |
