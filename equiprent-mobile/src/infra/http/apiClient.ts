// INFRAESTRUCTURA HTTP (Guía 08): cliente HTTP único de EquipRent Mobile.
// Las pantallas NO llaman a fetch directamente: pasan por los servicios
// (unidadesApi, mantenimientosApi, healthApi) y los servicios pasan por aquí.
// Cambiar la URL o agregar cabeceras (por ejemplo, el token JWT de la Guía 11)
// se hace en un solo lugar.

/**
 * URL base del backend Spring Boot.
 * Se configura en equiprent-mobile/.env.local (ver .env.example):
 *   EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api
 * - Android Emulator: 10.0.2.2 es el alias del localhost de la PC anfitriona.
 *   Dentro del emulador, "localhost" apunta al propio teléfono virtual.
 * - Teléfono físico con Expo Go: usar la IP de la PC en la red Wi-Fi
 *   (por ejemplo http://192.168.0.15:8080/api).
 * Tras cambiar el .env hay que reiniciar Metro (npx expo start -c).
 */
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080/api';

/** Tiempo máximo de espera antes de abortar una petición (ms). */
export const TIEMPO_LIMITE_MS = 10000;

/** Error HTTP con el código de estado devuelto por el backend (400, 404, 409, 500...). */
export class HttpError extends Error {
    readonly status: number;
    /** Errores por campo que devuelve @Valid en Spring Boot (si existen). */
    readonly fieldErrors: Record<string, string>;

    constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
        this.name = 'HttpError';
    }
}

/** Forma del cuerpo de error que devuelve el backend (record ApiError). */
type CuerpoError = { message?: unknown; fieldErrors?: Record<string, string> };

/**
 * Ejecuta una petición HTTP y devuelve el JSON ya tipado.
 *
 * IMPORTANTE: fetch solo rechaza la promesa cuando falla la RED.
 * Un 404 o un 500 llegan como respuesta "exitosa" de fetch; por eso se revisa
 * respuesta.ok y se lanza el error a mano.
 *
 * Tipos de fallo que distingue:
 *  - Tiempo agotado (10 s)      -> Error 'El servidor no respondió...'
 *  - Sin conexión / URL errónea -> Error 'Fallo de conexión...'
 *  - Respuesta no JSON          -> HttpError 502
 *  - 4xx / 5xx                  -> HttpError con el mensaje del backend
 */
export async function requestHttp<T>(ruta: string, opciones: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${ruta}`;
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), TIEMPO_LIMITE_MS);

    let respuesta: Response;
    try {
        respuesta = await fetch(url, {
            ...opciones,
            signal: controlador.signal,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...opciones.headers,
            },
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`El servidor no respondió en ${TIEMPO_LIMITE_MS / 1000} segundos: ${url}`);
        }
        // Servidor apagado, IP incorrecta o sin Wi-Fi.
        throw new Error(`Fallo de conexión con el backend: No se pudo recuperar ${url}`);
    } finally {
        clearTimeout(temporizador);
    }

    // Se lee como texto primero: así un cuerpo vacío (204) o un HTML de error no rompen JSON.parse.
    const texto = await respuesta.text();
    let datos: unknown = null;
    if (texto) {
        try {
            datos = JSON.parse(texto);
        } catch {
            if (respuesta.ok) {
                throw new HttpError(502, `El servidor no envió JSON válido en ${url}`);
            }
        }
    }

    if (!respuesta.ok) {
        const cuerpo = (datos ?? {}) as CuerpoError;
        const mensaje =
            typeof cuerpo.message === 'string' && cuerpo.message
                ? cuerpo.message
                : `El servidor respondió ${respuesta.status} en ${url}`;
        throw new HttpError(respuesta.status, mensaje, cuerpo.fieldErrors ?? {});
    }

    // 204 No Content (por ejemplo, un DELETE): datos queda en null.
    return datos as T;
}

/**
 * Texto legible para mostrar un error en pantalla (Alert o mensaje rojo).
 * 409 = conflicto de negocio (duplicado, tiene dependencias), 400 = validación,
 * 404 = no existe; cualquier otro caso usa el mensaje original.
 */
export function mensajeDeError(error: unknown): string {
    if (error instanceof HttpError) {
        const prefijo =
            error.status === 409
                ? 'Conflicto'
                : error.status === 400
                  ? 'Datos rechazados'
                  : error.status === 404
                    ? 'No encontrado'
                    : `Error ${error.status}`;
        return `${prefijo} (HTTP ${error.status}): ${error.message}`;
    }
    return error instanceof Error ? error.message : 'Error inesperado.';
}
