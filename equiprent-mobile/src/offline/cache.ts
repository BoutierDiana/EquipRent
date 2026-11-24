import * as SQLite from 'expo-sqlite';
import { unidadesApi, type ActualizarUnidadRequest, type UnidadEquipoDto } from '../infra/http/unidadesApi';

/**
 * OFFLINE (Guía 12): caché SQLite de unidades + cola MANUAL de ediciones pendientes.
 *
 *  cached_unidades  -> copia de GET /api/unidades-equipo para consultar SIN red.
 *  pending_updates  -> ediciones hechas sin red; se envían con PUT al pulsar "Sincronizar".
 *
 * Control de conflictos: el backend no tiene @Version, así que cada pendiente guarda
 * la unidad ORIGINAL (tal como se descargó). Antes del PUT se consulta el servidor: si
 * la unidad cambió mientras tanto, NO se sobrescribe y el pendiente queda en CONFLICTO.
 *
 * Seguridad SQL: execAsync solo con SQL constante; los valores siempre van como parámetros (?).
 * Límite (igual que la guía): no hay altas ni bajas offline, solo ediciones de unidades existentes.
 */

type FilaUnidad = {
    id: number;
    equipo_id: number;
    numero_serie: string;
    estado_operativo: string;
    metrica_uso: number;
    notas_estado: string | null;
    activo: number; // SQLite no tiene boolean: 1 / 0
    created_at: string;
};

type FilaPendiente = {
    unidad_id: number;
    cambios_json: string; // ActualizarUnidadRequest
    original_json: string; // UnidadEquipoDto al momento de descargar
    guardado_en: string;
    conflicto: string | null; // motivo si la última sincronización lo rechazó
};

export type Pendiente = {
    unidadId: number;
    cambios: ActualizarUnidadRequest;
    original: UnidadEquipoDto;
    guardadoEn: string;
    conflicto: string | null;
};

export type ResultadoSincronizacion = { correctos: number; conflictos: string[]; errores: string[] };

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;
let iniciada = false;

/** Abre (una sola vez) la base local y crea las tablas si no existen. */
async function database(): Promise<SQLite.SQLiteDatabase> {
    if (!dbPromise) dbPromise = SQLite.openDatabaseAsync('equiprent_offline.db');
    const db = await dbPromise;
    if (!iniciada) {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS cached_unidades (
                id INTEGER PRIMARY KEY,
                equipo_id INTEGER NOT NULL,
                numero_serie TEXT NOT NULL,
                estado_operativo TEXT NOT NULL,
                metrica_uso REAL NOT NULL,
                notas_estado TEXT,
                activo INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS pending_updates (
                unidad_id INTEGER PRIMARY KEY,
                cambios_json TEXT NOT NULL,
                original_json TEXT NOT NULL,
                guardado_en TEXT NOT NULL,
                conflicto TEXT
            );
            CREATE TABLE IF NOT EXISTS cache_meta (
                clave TEXT PRIMARY KEY,
                valor TEXT NOT NULL
            );
            PRAGMA user_version = 1;
        `);
        iniciada = true;
    }
    return db;
}

function aDto(f: FilaUnidad): UnidadEquipoDto {
    return {
        id: f.id,
        equipoId: f.equipo_id,
        numeroSerie: f.numero_serie,
        estadoOperativo: f.estado_operativo,
        metricaUsoAcumulada: f.metrica_uso,
        notasEstado: f.notas_estado,
        activo: f.activo === 1,
        createdAt: f.created_at,
    };
}

function aPendiente(f: FilaPendiente): Pendiente {
    return {
        unidadId: f.unidad_id,
        cambios: JSON.parse(f.cambios_json) as ActualizarUnidadRequest,
        original: JSON.parse(f.original_json) as UnidadEquipoDto,
        guardadoEn: f.guardado_en,
        conflicto: f.conflicto,
    };
}

async function guardarEnCache(db: SQLite.SQLiteDatabase, u: UnidadEquipoDto): Promise<void> {
    await db.runAsync(
        `INSERT OR REPLACE INTO cached_unidades
         (id, equipo_id, numero_serie, estado_operativo, metrica_uso, notas_estado, activo, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        u.id,
        u.equipoId,
        u.numeroSerie,
        u.estadoOperativo,
        u.metricaUsoAcumulada,
        u.notasEstado,
        u.activo ? 1 : 0,
        u.createdAt
    );
}

/** Lee el caché local: funciona SIN conexión. */
export async function listarCache(): Promise<UnidadEquipoDto[]> {
    const db = await database();
    const filas = await db.getAllAsync<FilaUnidad>('SELECT * FROM cached_unidades ORDER BY numero_serie');
    return filas.map(aDto);
}

export async function buscarEnCache(id: number): Promise<UnidadEquipoDto | null> {
    const db = await database();
    const fila = await db.getFirstAsync<FilaUnidad>('SELECT * FROM cached_unidades WHERE id = ?', id);
    return fila ? aDto(fila) : null;
}

/** Fecha ISO de la última descarga, o null si nunca se descargó. */
export async function ultimaDescarga(): Promise<string | null> {
    const db = await database();
    const fila = await db.getFirstAsync<{ valor: string }>(
        "SELECT valor FROM cache_meta WHERE clave = 'ultima_descarga'"
    );
    return fila?.valor ?? null;
}

/**
 * GET /api/unidades-equipo y reemplaza el caché en UNA transacción
 * (si algo falla a la mitad, el caché anterior queda intacto).
 */
export async function descargarUnidades(): Promise<number> {
    const remotas = await unidadesApi.listar(); // si no hay red, lanza ANTES de tocar SQLite
    const db = await database();
    await db.withTransactionAsync(async () => {
        await db.runAsync('DELETE FROM cached_unidades');
        for (const u of remotas) await guardarEnCache(db, u);
        await db.runAsync(
            "INSERT OR REPLACE INTO cache_meta (clave, valor) VALUES ('ultima_descarga', ?)",
            new Date().toISOString()
        );
    });
    return remotas.length;
}

/**
 * Guarda una edición hecha sin red. Si ya había un pendiente para esa unidad,
 * se reemplazan los cambios pero se CONSERVA el original de la primera edición.
 */
export async function dejarPendiente(original: UnidadEquipoDto, cambios: ActualizarUnidadRequest): Promise<void> {
    const db = await database();
    const previo = await db.getFirstAsync<FilaPendiente>(
        'SELECT * FROM pending_updates WHERE unidad_id = ?',
        original.id
    );
    await db.runAsync(
        `INSERT OR REPLACE INTO pending_updates (unidad_id, cambios_json, original_json, guardado_en, conflicto)
         VALUES (?, ?, ?, ?, NULL)`,
        original.id,
        JSON.stringify(cambios),
        previo ? previo.original_json : JSON.stringify(original),
        new Date().toISOString()
    );
}

export async function listarPendientes(): Promise<Pendiente[]> {
    const db = await database();
    const filas = await db.getAllAsync<FilaPendiente>('SELECT * FROM pending_updates ORDER BY guardado_en');
    return filas.map(aPendiente);
}

export async function buscarPendiente(unidadId: number): Promise<Pendiente | null> {
    const db = await database();
    const fila = await db.getFirstAsync<FilaPendiente>(
        'SELECT * FROM pending_updates WHERE unidad_id = ?',
        unidadId
    );
    return fila ? aPendiente(fila) : null;
}

/** Descarta un cambio pendiente (por ejemplo, tras un conflicto). */
export async function descartarPendiente(unidadId: number): Promise<void> {
    const db = await database();
    await db.runAsync('DELETE FROM pending_updates WHERE unidad_id = ?', unidadId);
}

/** Compara los campos editables: ¿la unidad del servidor sigue igual que al descargarla? */
function mismaVersion(a: UnidadEquipoDto, b: UnidadEquipoDto): boolean {
    return (
        a.equipoId === b.equipoId &&
        a.numeroSerie === b.numeroSerie &&
        a.estadoOperativo === b.estadoOperativo &&
        Number(a.metricaUsoAcumulada) === Number(b.metricaUsoAcumulada) &&
        (a.notasEstado ?? '') === (b.notasEstado ?? '') &&
        a.activo === b.activo
    );
}

/**
 * Sincronización MANUAL: envía cada pendiente con PUT.
 *  - OK            -> se borra de la cola y se actualiza el caché.
 *  - Conflicto     -> la unidad cambió en el servidor (o fue eliminada): se marca y NO se envía.
 *  - Error de red  -> queda en la cola, se reintenta la próxima vez.
 *  - 400/409       -> queda en la cola marcado como conflicto (exige revisión manual).
 */
export async function sincronizarPendientes(): Promise<ResultadoSincronizacion> {
    const db = await database();
    const pendientes = await listarPendientes();
    const resultado: ResultadoSincronizacion = { correctos: 0, conflictos: [], errores: [] };

    for (const p of pendientes) {
        const etiqueta = p.original.numeroSerie;
        let actual: UnidadEquipoDto;
        try {
            actual = await unidadesApi.obtener(p.unidadId);
        } catch (e) {
            const status = (e as { status?: number }).status;
            if (status === 404) {
                await marcarConflicto(db, p.unidadId, 'La unidad ya no existe en el servidor.');
                resultado.conflictos.push(`${etiqueta}: eliminada en el servidor`);
            } else {
                resultado.errores.push(`${etiqueta}: ${e instanceof Error ? e.message : 'error'}`);
            }
            continue;
        }

        if (!mismaVersion(actual, p.original)) {
            await marcarConflicto(db, p.unidadId, 'Otra persona modificó la unidad después de tu descarga.');
            await guardarEnCache(db, actual); // el caché muestra la versión real del servidor
            resultado.conflictos.push(`${etiqueta}: modificada en el servidor`);
            continue;
        }

        try {
            const guardada = await unidadesApi.actualizar(p.unidadId, p.cambios);
            await db.withTransactionAsync(async () => {
                await db.runAsync('DELETE FROM pending_updates WHERE unidad_id = ?', p.unidadId);
                await guardarEnCache(db, guardada);
            });
            resultado.correctos++;
        } catch (e) {
            const status = (e as { status?: number }).status;
            const mensaje = e instanceof Error ? e.message : 'error';
            if (status === 400 || status === 409) {
                await marcarConflicto(db, p.unidadId, `Rechazado por el servidor: ${mensaje}`);
                resultado.conflictos.push(`${etiqueta}: ${mensaje}`);
            } else {
                resultado.errores.push(`${etiqueta}: ${mensaje}`);
            }
        }
    }
    return resultado;
}

async function marcarConflicto(db: SQLite.SQLiteDatabase, unidadId: number, motivo: string): Promise<void> {
    await db.runAsync('UPDATE pending_updates SET conflicto = ? WHERE unidad_id = ?', motivo, unidadId);
}

/** Vacía caché y cola (por ejemplo, al cerrar sesión en un dispositivo compartido). */
export async function borrarTodoOffline(): Promise<void> {
    const db = await database();
    await db.execAsync('DELETE FROM cached_unidades; DELETE FROM pending_updates; DELETE FROM cache_meta;');
}
