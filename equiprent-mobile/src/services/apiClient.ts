// Cliente HTTP único de EquipRent Mobile.
// Las pantallas NO llaman a fetch directamente: pasan por los servicios,
// y los servicios pasan por aquí. Cambiar la URL o agregar cabeceras
// (por ejemplo, un token) se hace en un solo lugar.

/**
 * URL base del backend Spring Boot.
 * - Android Emulator: 10.0.2.2 es el alias del localhost de la PC anfitriona.
 *   Dentro del emulador, "localhost" apunta al propio teléfono virtual.
 * - Teléfono físico con Expo Go: reemplazar por la IP de la PC en la red Wi-Fi
 *   (por ejemplo http://192.168.0.15:8080/api).
 */
export const API_BASE_URL = 'http://10.0.2.2:8080/api';

/** Tiempo máximo de espera antes de abortar una petición (ms). */
const TIEMPO_LIMITE_MS = 10000;

/** Error HTTP con el código de estado devuelto por el backend. */
export class HttpError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

/** Forma del cuerpo de error que devuelve el backend (record ApiError). */
type CuerpoError = { message?: string; fieldErrors?: Record<string, string> };

/**
 * Ejecuta una petición HTTP y devuelve el JSON ya tipado.
 *
 * IMPORTANTE: fetch solo rechaza la promesa cuando falla la RED.
 * Un 404 o un 500 llegan como respuesta "exitosa" de fetch; por eso se revisa
 * respuesta.ok y se lanza el error a mano.
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
    } catch {
        // Servidor apagado, IP incorrecta, sin Wi-Fi o tiempo agotado.
        throw new Error(`Fallo de conexión con el backend: No se pudo recuperar ${url}`);
    } finally {
        clearTimeout(temporizador);
    }

    if (!respuesta.ok) {
        let mensaje = `El servidor respondió ${respuesta.status} en ${url}`;
        try {
            const cuerpo = (await respuesta.json()) as CuerpoError;
            if (cuerpo.message) {
                mensaje = cuerpo.message;
            }
        } catch {
            // El cuerpo no era JSON: se conserva el mensaje genérico.
        }
        throw new HttpError(respuesta.status, mensaje);
    }

    // 204 No Content (por ejemplo, un DELETE): no hay JSON que leer.
    if (respuesta.status === 204) {
        return undefined as T;
    }

    return (await respuesta.json()) as T;
}