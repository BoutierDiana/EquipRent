const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** Intenta extraer el campo message del ApiErrorResponse del backend. */
function leerMensaje(texto: string, statusText: string): string {
  if (!texto) return statusText || 'Error HTTP';
  try {
    const cuerpo = JSON.parse(texto) as {
      message?: string;
      fieldErrors?: Record<string, string>;
    };
    const campos = cuerpo.fieldErrors
      ? Object.entries(cuerpo.fieldErrors).map(([k, v]) => `${k}: ${v}`)
      : [];
    return [cuerpo.message, ...campos].filter(Boolean).join(' · ') || statusText;
  } catch {
    return texto;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error('Falta configurar VITE_API_URL en .env.development');
  }

  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

  // fetch NO lanza excepción con 404 o 500: hay que revisar response.ok
  if (!response.ok) {
    const detail = await response.text();
    throw new ApiError(response.status, leerMensaje(detail, response.statusText));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
