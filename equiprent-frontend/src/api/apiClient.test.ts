import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// apiClient lee VITE_API_URL al cargarse: se define antes de importarlo en cada test.
async function cargarApiClient() {
    vi.resetModules();
    vi.stubEnv('VITE_API_URL', 'http://localhost:8080/api');
    return import('./apiClient');
}

describe('apiFetch', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
    });

    it('devuelve el JSON cuando response.ok es true', async () => {
        const { apiFetch } = await cargarApiClient();
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify([{ id: 1 }]), { status: 200 }));

        await expect(apiFetch('/unidades-equipo')).resolves.toEqual([{ id: 1 }]);
        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api/unidades-equipo', expect.anything());
    });

    it('devuelve undefined en 204 sin intentar leer JSON', async () => {
        const { apiFetch } = await cargarApiClient();
        vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 204 }));

        await expect(apiFetch('/unidades-equipo/4', { method: 'DELETE' })).resolves.toBeUndefined();
    });

    it('convierte un 409 del backend en ApiError con el mensaje legible', async () => {
        const { apiFetch, ApiError } = await cargarApiClient();
        const body = { status: 409, message: 'No se puede eliminar la unidad de equipo con ID 3', fieldErrors: {} };
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(body), { status: 409 }));

        const error = await apiFetch('/unidades-equipo/3', { method: 'DELETE' }).catch((e: unknown) => e);
        expect(error).toBeInstanceOf(ApiError);
        expect(error).toMatchObject({ status: 409, message: body.message });
    });

    it('incluye los fieldErrors de un 400 en el mensaje', async () => {
        const { apiFetch } = await cargarApiClient();
        const body = { status: 400, message: 'Error de validación', fieldErrors: { numeroSerie: 'obligatorio' } };
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(body), { status: 400 }));

        await expect(apiFetch('/unidades-equipo', { method: 'POST', body: '{}' })).rejects.toThrow(
            'Error de validación (numeroSerie: obligatorio)',
        );
    });

    it('traduce un fallo de red en un mensaje comprensible', async () => {
        const { apiFetch } = await cargarApiClient();
        vi.mocked(fetch).mockRejectedValue(new TypeError('Failed to fetch'));

        await expect(apiFetch('/health')).rejects.toThrow(/No se pudo conectar con el servidor/);
    });
});
