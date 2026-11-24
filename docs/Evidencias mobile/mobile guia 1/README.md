# Evidencias mobile · Guía 01 · React Native + Android Studio

**Proyecto:** EquipRent · Sistema de Gestión de Alquiler de Maquinaria/Equipos y Órdenes de Mantenimiento
**Materia:** Programación Aplicada
**App móvil:** `equiprent-mobile/` (Expo, plantilla `blank-typescript`, TypeScript)
**Dispositivo:** Android Emulator · AVD `Pixel_8_EquipRent` (API 36, Google Play, x86_64)

---

## 1. Lista de control individual

| OK | Comprobación | Evidencia requerida | Archivo | Estado |
|---|---|---|---|---|
| [x] | A. Windows y hardware | RAM, arquitectura y estado de virtualización | `00_hardware_virtualizacion.png` | CPU y virtualización listos; falta RAM y arquitectura |
| [x] | B. Node y npm | `node -v` y `npm -v` sin errores | `01_versiones_node_npm.png` | Listo |
| [ ] | C. Android Studio | SDK Manager y Device Manager identificados | `02_android_sdk_manager.png` | Pendiente |
| [ ] | D. SDK / ADB | `echo $env:ANDROID_HOME` y `adb version` | `03a_android_home_adb_version.png` | Pendiente |
| [ ] | E. Dispositivo | `adb devices -l` muestra `emulator-5554 ... device` | `03_adb_devices.png` | Pendiente (repetir con letra L) |
| [x] | F. Proyecto | Existe `equiprent-mobile` con `App.tsx` y `package.json` | `04_estructura_proyecto.png` | Listo |
| [ ] | G. Arranque Expo | `npx expo start` desde la carpeta correcta, `Android Bundled` | `05_expo_iniciado.png` | Pendiente |
| [x] | H. Pantalla | EquipRent visible en el emulador | `06_pantalla_unidades.png` | Listo |
| [x] | I. Interacción | Tocar Unidades de Equipo / Mantenimientos cambia el panel (`useState`) | `06_pantalla_unidades.png`, `07_pantalla_mantenimientos.png` | Listo |
| [x] | J. Explicación | Por qué aún no se consultan datos REST ni PostgreSQL | Sección 4 de este archivo | Listo |
| [x] | Bitácora | Al menos un diagnóstico documentado | `08_bitacora_diagnostico.txt` | Listo (6 diagnósticos) |

Marcar cada casilla con `[x]` cuando la captura esté en esta carpeta.

### Datos del entorno verificados

| Elemento | Valor observado |
|---|---|
| CPU | 13th Gen Intel Core i9-13900H · 14 núcleos · 20 procesadores lógicos |
| Virtualización | Habilitado (Administrador de tareas → Rendimiento → CPU) |
| RAM / arquitectura | Pendiente (Configuración → Sistema → Información) |
| Node.js | v26.9.0 |
| npm | 11.19.1 |
| Android SDK | `C:\Users\ASUS\AppData\Local\Android\Sdk` |
| Imagen del AVD | `system-images;android-36;google_apis_playstore;x86_64` |
| Expo SDK | ~56.0.24 |
| React Native | 0.85.3 |
| react-native-safe-area-context | ~5.7.0 |

---

## 2. Ficha de adaptación (Sección 14)

| Pregunta | Ejemplo ParkFlow360 | EquipRent |
|---|---|---|
| ¿Cuál es el sistema? | ParkFlow360 | EquipRent |
| ¿Entidad padre (1)? | Cliente | UnidadEquipo |
| ¿Entidad hija (N)? | Vehículo | Mantenimiento |
| ¿Qué pantalla presentarás primero? | Selección Clientes / Vehículos | Selección Unidades de Equipo / Mantenimientos |
| ¿Cómo se llama tu backend? | Spring Boot hexagonal | Spring Boot + PostgreSQL + Flyway (EquipRent API) |
| ¿Cuál es tu frontend Web? | React + TypeScript + Vite | React + TypeScript + Vite (`equiprent-frontend`) |
| ¿Qué operación probarás luego? | Listar Clientes | Listar Unidades de Equipo (`GET /api/unidades-equipo`) |

### Relación uno a muchos

Una **UnidadEquipo** puede tener muchos **Mantenimientos**; cada **Mantenimiento** pertenece a una sola UnidadEquipo mediante la clave foránea `________________` (copiar el nombre exacto de la columna desde la migración Flyway del backend).

- La pantalla de **Unidades de Equipo** listará las unidades registradas.
- La pantalla de **Mantenimientos** mostrará las órdenes de mantenimiento de una unidad seleccionada.
- La relación y sus reglas viven en el backend; la app móvil solo la presentará.

---

## 3. Lo que se construyó

- Entorno reproducible: Node + npm, Android Studio, Android SDK, ADB en el `PATH` mediante `ANDROID_HOME`, AVD `Pixel_8_EquipRent`.
- Proyecto Expo creado con `npx create-expo-app@latest equiprent-mobile --template blank-typescript`.
- Dependencia `react-native-safe-area-context` instalada con `npx expo install` (versión compatible con el SDK).
- `App.tsx` propio con:
  - `type Seccion = 'unidades' | 'mantenimientos'` y `useState<Seccion>('unidades')`.
  - Dos `Pressable` con `accessibilityRole`, `accessibilityLabel` y `accessibilityState`.
  - Panel que cambia de título y descripción según el estado.
  - `SafeAreaProvider` + `SafeAreaView` y `ScrollView`.
  - Indicadores en **0** y aviso explícito "Sin API ni base de datos aún".
  - Estética Cyber-Industrial (`#0b0614`, `#140b24`, `#a855f7`, `#ccff00`) sin emojis.

### Cadena de una pulsación

El dedo toca `Pressable` → se ejecuta `onPress` → `setSeccion('mantenimientos')` cambia el estado → `esUnidades` pasa a `false` → React vuelve a ejecutar `App` → cambia el título y el texto del panel → Android representa la interfaz actualizada.

No se ejecuta ningún controlador Spring Boot, no se consulta PostgreSQL y no se navega a otra pantalla.

---

## 4. Lo que NO se implementó (y por qué)

- **No hay llamadas HTTP** (`fetch`) al backend: los indicadores en 0 son literales en `App.tsx`. Mostrar una cifra inventada como si viniera de PostgreSQL sería una falsa validación.
- **No hay CRUD**, ni formularios, ni validaciones: corresponden a guías posteriores.
- **No hay navegación real**: el cambio de panel es estado local; Expo Router llega en la Guía 03.
- **No se generó APK ni AAB**: la app corre en Expo Go, que es un entorno de aprendizaje, no una build distribuible.
- **No se habilitó HTTP inseguro** ni se configuró la IP del backend, porque aún no hay integración REST.
- El estado (`useState`) **no es persistente**: al cerrar la app vuelve a "unidades".

---

## 5. Retos de ampliación

**Reto A · ¿Por qué el contador está en cero y cómo cambiaría?**
Está en cero porque `App.tsx` no consulta ninguna API: el número está escrito a mano. Cuando se integre el backend, el valor dejará de ser literal y vendrá de la respuesta de `GET /api/unidades-equipo` (por ejemplo, la cantidad de elementos devueltos), obtenida con `fetch` + `async/await`, verificando `response.ok` antes de usar los datos. Desde el emulador la URL base será `http://10.0.2.2:8080`, no `localhost`.

**Reto B · ScrollView y SafeAreaView en pantallas pequeñas**
`ScrollView` permite desplazar el contenido cuando no cabe completo en la pantalla, evitando que los botones o el panel queden cortados. `SafeAreaView` (de `react-native-safe-area-context`) reserva las zonas ocupadas por la barra de estado, la cámara perforada del Pixel 8 y la barra de gestos, para que el contenido no quede tapado por elementos del sistema.

---

## 6. Archivos de esta carpeta

```
docs/Evidencias mobile/mobile guia 1/
  README.md
  00_hardware_virtualizacion.png
  01_versiones_node_npm.png
  02_android_sdk_manager.png
  03a_android_home_adb_version.png
  03_adb_devices.png
  04_estructura_proyecto.png
  05_expo_iniciado.png
  06_pantalla_unidades.png
  07_pantalla_mantenimientos.png
  08_bitacora_diagnostico.txt
```
