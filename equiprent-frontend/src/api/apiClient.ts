const API_URL = import.meta.env.VITE_API_URL;

/** Error HTTP con el status y, si el backend lo envió, el detalle por campo. */
export class ApiError extends Error {
    status: number;
    fieldErrors: Record<string, string>;

    constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
        super(message);
        this.status = status;
        this.fieldErrors = fieldErrors;
        this.name = 'ApiError';
    }
}

/** Forma del cuerpo de error del backend (record ApiError en Spring Boot). */
interface ApiErrorBody {
    status?: number;
    message?: string;
    fieldErrors?: Record<string, string>;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
    return typeof value === 'object' && value !== null && 'message' in value;
}

/** Convierte una respuesta no exitosa en un mensaje legible para el usuario. */
async function toApiError(response: Response): Promise<ApiError> {
    const text = await response.text();
    let message = text || response.statusText || 'Error en la petición HTTP';
    let fieldErrors: Record<string, string> = {};

    try {
        const body: unknown = text ? JSON.parse(text) : null;
        if (isApiErrorBody(body)) {
            fieldErrors = body.fieldErrors ?? {};
            const detalle = Object.entries(fieldErrors)
                .map(([campo, msg]) => `${campo}: ${msg}`)
                .join(' · ');
            message = detalle ? `${body.message} (${detalle})` : (body.message ?? message);
        }
    } catch {
        // El cuerpo no era JSON (por ejemplo, un HTML de proxy): se usa el texto tal cual.
    }

    return new ApiError(response.status, message, fieldErrors);
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    if (!API_URL) {
        throw new Error('Falta configurar la variable de entorno VITE_API_URL');
    }

    const headers = new Headers(options.headers);
    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    let response: Response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers,
        });
    } catch (error) {
        // Una cancelación (AbortController) no es un fallo: se propaga tal cual.
        if (error instanceof DOMException && error.name === 'AbortError') {
            throw error;
        }
        // fetch solo rechaza por red/CORS/backend apagado; un 404 o 500 llega como Response.
        throw new ApiError(
            0,
            'No se pudo conectar con el servidor. Verifique que el backend esté encendido y que CORS permita este origen.',
        );
    }

    // fetch NO lanza por 4xx/5xx: hay que revisar response.ok.
    if (!response.ok) {
        throw await toApiError(response);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
