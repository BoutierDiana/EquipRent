# ADR-002 — Migraciones versionadas con Flyway

Fecha: 2026-10-20 · Estado: aceptada

## 1. Contexto
Los scripts `V1__init_core.sql` y `V2__seed_core.sql` se ejecutaban a mano en DataGrip y vivían en `docs/`. El V1 estaba guardado en UTF-16, una codificación que Flyway y `psql` no leen. El backend usa `ddl-auto=validate`, así que depende de que el esquema exista antes de arrancar.

## 2. Problema
Hacer el esquema reproducible: que cualquier integrante pueda recrear la base desde cero y que los cambios futuros queden versionados.

## 3. Alternativas consideradas
1. Seguir ejecutando scripts a mano.
2. Dejar que Hibernate genere el esquema (`ddl-auto=update`).
3. Flyway con migraciones en `src/main/resources/db/migration`.

## 4. Decisión
Flyway (alternativa 3), como piden las guías de Clase 06 y 07.
- Las migraciones viven en `docs/equiprent-backend/src/main/resources/db/migration/` (V1 convertido a UTF-8).
- `spring.flyway.baseline-on-migrate=true` con `baseline-version=2`: en una base que ya tiene V1 y V2 aplicados a mano, Flyway registra esa línea base y solo ejecuta V3 y V4. En una base vacía ejecuta V1 a V4.
- Hibernate sigue en `validate`: verifica el esquema, nunca lo modifica.

## 5. Consecuencias
- Ningún script ya aplicado se edita; los cambios se hacen con una migración nueva (V5, V6...).
- Si la base local tuviera V1 aplicado pero no V2, hay que cambiar `baseline-version` a 1 antes del primer arranque.
- Las consultas de estudio (`class08_joins.sql`) quedan en `db/queries/`, fuera de la carpeta que Flyway ejecuta.
