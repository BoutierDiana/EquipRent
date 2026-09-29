-- =====================================================================
-- EquipRent · 00 · Script administrativo
-- Ejecutar conectado como: usuario postgres / base postgres
-- CREATE DATABASE debe ejecutarse SOLO (fuera de BEGIN/COMMIT).
-- CAMBIA la contraseña antes de ejecutar y NO la subas a GitHub.
-- =====================================================================

-- 0. Verificar dónde estoy (debe decir postgres / postgres)
SELECT current_user AS usuario_actual,
       current_database() AS base_actual,
       version() AS version_postgresql;

-- 1. Crear el administrador del laboratorio
CREATE ROLE equiprent_admin
WITH
    LOGIN
    PASSWORD 'Cambia_Esta_Clave_2026!'
    SUPERUSER
    CREATEDB
    CREATEROLE
    INHERIT;

-- 2. Comprobar el rol
SELECT rolname, rolcanlogin, rolsuper, rolcreatedb, rolcreaterole
FROM pg_roles
WHERE rolname = 'equiprent_admin';

-- 3. Crear la base de datos (ejecutar esta sentencia sola)
CREATE DATABASE equiprent
    WITH
    OWNER = equiprent_admin
    ENCODING = 'UTF8'
    TEMPLATE = template0;

-- 4. Verificar base y propietario
SELECT d.datname AS base_datos,
       r.rolname AS propietario
FROM pg_database d
JOIN pg_roles r ON r.oid = d.datdba
WHERE d.datname = 'equiprent';

-- ---------------------------------------------------------------------
-- SIGUIENTE PASO: crear en DataGrip una NUEVA conexión
--   Host localhost · Port 5432 · Database equiprent · User equiprent_admin
-- y ejecutar allí V1__creacion_completa_equiprent.sql
-- ---------------------------------------------------------------------

-- SOLO SI NECESITAS EMPEZAR DE CERO (conectado a postgres, sin sesiones
-- abiertas hacia equiprent):
-- DROP DATABASE IF EXISTS equiprent;
-- DROP ROLE IF EXISTS equiprent_admin;
