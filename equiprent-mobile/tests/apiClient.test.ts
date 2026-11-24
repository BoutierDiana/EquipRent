import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// SecureStore simulado: cada prueba decide si hay token guardado.
const almacen = vi.hoisted(() => ({ token: null as string | null }));
vi.mock('expo-secure-store', () => ({
    getItemAsync: vi.fn(async () => almacen.token),
    setItemAsync: vi.fn(),
    deleteItemAsync: vi.fn(),
}));

import {
    API_BASE_URL,
    HttpError,
    mensajeDeError,
    registrarAlNoAutorizado,
    requestHttp,
} from '../src/infra/http/apiClient';

/** Respuesta HTTP falsa con el cuerpo como texto (igual que la lee apiClient). */
function respuesta(status: number, cuerpo: string) {
    return { ok: status >= 200 && status < 300, status, text: async () => cuerpo } as Response;
}

const fetchFalso = vi.fn<typeof fetch>();

beforeEach(() => {
    almacen.token = null;
    fetchFalso.mockReset();
    vi.stubGlobal('fetch', fetchFalso);
});

afterEach(() => {
    registrarAlNoAutorizado(null);
    vi.unstubAllGlobals();
    vi.useRealTimers();
});

/** Cabeceras que apiClient le pasó a fetch en la llamada n. */
function cabeceras(n = 0): Record<string, string> {
    return (fetchFalso.mock.calls[n][1]?.headers ?? {}) as Record<string, string>;
}

describe('requestHttp: respuestas correctas', () => {
    it('200 -> devuelve el JSON y arma la URL con API_BASE_URL', async () => {
        fetchFalso.mockResolvedValue(respuesta(200, '[{"id":1}]'));
        await expect(requestHttp('/unidades-equipo')).resolves.toEqual([{ id: 1 }]);
        expect(fetchFalso.mock.calls[0][0]).toBe(`${API_BASE_URL}/unidades-equipo`);
    });

    it('204 sin cuerpo -> null (no rompe JSON.parse)', async () => {
        fetchFalso.mockResolvedValue(respuesta(204, ''));
        await expect(requestHttp('/unidades-equipo/1', { method: 'DELETE' })).resolves.toBeNull();
    });

    it('200 con HTML en vez de JSON -> HttpError 502', async () => {
        fetchFalso.mockResolvedValue(respuesta(200, '<html>proxy</html>'));
        await expect(requestHttp('/health')).rejects.toMatchObject({ status: 502 });
    });

    it('rechaza rutas absolutas: el token nunca viaja a otro dominio', async () => {
        almacen.token = 'secreto';
        await expect(requestHttp('https://otro-sitio.com/robar')).rejects.toThrow('/');
        expect(fetchFalso).not.toHaveBeenCalled();
    });
});

describe('requestHttp: errores del backend (ApiError)', () => {
    it('404 -> HttpError con el mensaje de Spring Boot', async () => {
        fetchFalso.mockResolvedValue(
            respuesta(404, '{"status":404,"message":"No existe la unidad de equipo con ID: 9"}')
        );
        const error = await requestHttp('/unidades-equipo/9').catch((e: unknown) => e);
        expect(error).toBeInstanceOf(HttpError);
        expect(error).toMatchObject({ status: 404, message: 'No existe la unidad de equipo con ID: 9' });
    });

    it('400 -> conserva fieldErrors para pintarlos bajo cada campo', async () => {
        fetchFalso.mockResolvedValue(
            respuesta(400, '{"message":"Error de validación","fieldErrors":{"numeroSerie":"obligatorio"}}')
        );
        await expect(requestHttp('/unidades-equipo', { method: 'POST' })).rejects.toMatchObject({
            status: 400,
            fieldErrors: { numeroSerie: 'obligatorio' },
        });
    });

    it('500 sin cuerpo -> mensaje genérico con el status', async () => {
        fetchFalso.mockResolvedValue(respuesta(500, ''));
        await expect(requestHttp('/x')).rejects.toThrow('500');
    });
});

describe('requestHttp: red', () => {
    it('servidor apagado -> "Fallo de conexión", NO "no existe"', async () => {
        fetchFalso.mockRejectedValue(new TypeError('Network request failed'));
        await expect(requestHttp('/unidades-equipo/1')).rejects.toThrow('Fallo de conexión');
    });

    it('sin respuesta en el tiempo límite -> aborta y lo explica', async () => {
        vi.useFakeTimers();
        fetchFalso.mockImplementation(
            (_url, init) =>
                new Promise((_, rechazar) => {
                    init?.signal?.addEventListener('abort', () => {
                        const e = new Error('aborted');
                        e.name = 'AbortError';
                        rechazar(e);
                    });
                })
        );
        const promesa = requestHttp('/lento', {}, 1000);
        const verificacion = expect(promesa).rejects.toThrow('no respondió en 1 segundos');
        await vi.advanceTimersByTimeAsync(1000);
        await verificacion;
    });
});

describe('requestHttp: seguridad JWT (Guía 11)', () => {
    it('sin sesión no envía Authorization', async () => {
        fetchFalso.mockResolvedValue(respuesta(200, '{}'));
        await requestHttp('/health');
        expect(cabeceras().Authorization).toBeUndefined();
    });

    it('con sesión adjunta "Bearer <token>"', async () => {
        almacen.token = 'abc.def.ghi';
        fetchFalso.mockResolvedValue(respuesta(200, '{}'));
        await requestHttp('/unidades-equipo');
        expect(cabeceras().Authorization).toBe('Bearer abc.def.ghi');
    });

    it('401 con token -> avisa para cerrar la sesión', async () => {
        almacen.token = 'vencido';
        const alNoAutorizado = vi.fn();
        registrarAlNoAutorizado(alNoAutorizado);
        fetchFalso.mockResolvedValue(respuesta(401, '{"message":"El token es inválido o expiró"}'));
        await expect(requestHttp('/unidades-equipo')).rejects.toMatchObject({ status: 401 });
        expect(alNoAutorizado).toHaveBeenCalledOnce();
    });

    it('401 del login (clave incorrecta) NO cierra la sesión', async () => {
        almacen.token = 'otro';
        const alNoAutorizado = vi.fn();
        registrarAlNoAutorizado(alNoAutorizado);
        fetchFalso.mockResolvedValue(respuesta(401, '{"message":"Usuario o contraseña incorrectos"}'));
        await expect(requestHttp('/auth/login', { method: 'POST' })).rejects.toThrow('incorrectos');
        expect(alNoAutorizado).not.toHaveBeenCalled();
    });
});

describe('requestHttp: multipart (Guía 13)', () => {
    it('JSON lleva Content-Type application/json', async () => {
        fetchFalso.mockResolvedValue(respuesta(200, '{}'));
        await requestHttp('/unidades-equipo', { method: 'POST', body: '{}' });
        expect(cabeceras()['Content-Type']).toBe('application/json');
    });

    it('FormData NO fija Content-Type (fetch agrega el boundary)', async () => {
        fetchFalso.mockResolvedValue(respuesta(201, '{"filename":"x.jpg"}'));
        await requestHttp('/mantenimientos/1/fotos', { method: 'POST', body: new FormData() });
        expect(cabeceras()['Content-Type']).toBeUndefined();
    });
});

describe('mensajeDeError', () => {
    it.each([
        [409, 'Conflicto'],
        [400, 'Datos rechazados'],
        [401, 'Sesión requerida'],
        [404, 'No encontrado'],
        [413, 'Archivo demasiado grande'],
        [503, 'Error 503'],
    ])('HTTP %i -> "%s"', (status, prefijo) => {
        expect(mensajeDeError(new HttpError(status, 'detalle'))).toBe(`${prefijo} (HTTP ${status}): detalle`);
    });

    it('errores que no son HTTP usan su propio mensaje', () => {
        expect(mensajeDeError(new Error('sin red'))).toBe('sin red');
        expect(mensajeDeError('???')).toBe('Error inesperado.');
    });
});
