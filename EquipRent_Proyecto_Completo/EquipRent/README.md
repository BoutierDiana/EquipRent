# EquipRent — Proyecto 15 · Programación Aplicada 2026-2

Entrega acumulada hasta el Capítulo 07 (Clases 02-05 + Capítulos 01-07), aplicada a **EquipRent**, no a ParkFlow.

Par 1:N del backend: **Equipo (padre) → UnidadEquipo (dependiente)**, FK `unidad_equipo.equipo_id`.

## Contenido
```
EquipRent/
├── docs/04-model/                  Clases 02 a 05 (documentación del modelo)
│   ├── model-conceptual-v0.1.md        Clase 02
│   ├── model-relational-v0.1.md        Clase 03
│   ├── der-logico-v0.1.md              Clase 04 (DER en Mermaid)
│   ├── diccionario-datos-v0.1.md       Clase 04
│   ├── decisiones-integridad-v0.1.md   Clase 04
│   ├── convenciones-bd-v0.1.md         Clase 05
│   ├── modelo-fisico-v0.1.md           Clase 05
│   └── plan-migracion-v1.md            Clase 05
├── datagrip/                       Clase 06 / Guía DataGrip
│   ├── 00_admin_crear_usuario_y_base.sql   (como postgres)
│   ├── V1__creacion_completa_equiprent.sql (18 tablas, como equiprent_admin)
│   ├── V2__datos_semilla.sql
│   └── 03_verificacion_y_pruebas.sql       (JOIN Cap. 07 + 11 pruebas negativas)
└── intellij/
    ├── equiprent-backend-lab/      Capítulos 01 y 02 (Java 21 puro)
    └── equiprent-backend/          Capítulos 03 a 07 (Spring Boot)
```

## Orden de trabajo
1. **DataGrip · conexión postgres/postgres** → ejecutar `00_admin_crear_usuario_y_base.sql` (cambia la clave).
2. **DataGrip · nueva conexión** `localhost:5432`, base `equiprent`, usuario `equiprent_admin` → ejecutar `V1`, luego `V2`.
3. Refresh → `equiprent > Schemas > equiprent > Tables` debe mostrar 18 tablas.
4. **IntelliJ** → abrir `equiprent-backend-lab` y ejecutar `Main`.
5. **IntelliJ** → abrir `equiprent-backend`, ejecutar `EquipRentApplication` y probar `requests.http`.
6. Volver a DataGrip y ejecutar `03_verificacion_y_pruebas.sql` (sección 5 y 6) para ver lo guardado desde la API.

## Verificado antes de entregar
- V1 + V2 ejecutados en PostgreSQL 16: 18 tablas y semilla cargada.
- Las 11 pruebas negativas SQL fallan con la constraint esperada.
- Laboratorio Java compilado y ejecutado con Java 21.
- Backend compilado y 6 pruebas unitarias del caso de uso pasando.

## Importante para la defensa
La cátedra pide que puedas explicar cada decisión sin leer. Revisa la sección "Respuestas de defensa rápidas" en `intellij/equiprent-backend/README.md` y los documentos de `docs/04-model`. No subas la contraseña real a GitHub.
