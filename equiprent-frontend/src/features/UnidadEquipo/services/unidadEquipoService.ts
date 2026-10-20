import { apiFetch } from '../../../api/apiClient';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import type {
    UnidadEquipoCreateRequest,
    UnidadEquipoUpdateRequest,
} from '../types/UnidadEquipoCreateRequest';

export const unidadEquipoService = {
    // GET /api/unidades-equipo
    listar(signal?: AbortSignal): Promise<UnidadEquipo[]> {
        return apiFetch<UnidadEquipo[]>('/unidades-equipo', { signal });
    },

    // GET /api/unidades-equipo/{id}
    obtenerPorId(id: number, signal?: AbortSignal): Promise<UnidadEquipo> {
        return apiFetch<UnidadEquipo>(`/unidades-equipo/${id}`, { signal });
    },

    // POST /api/unidades-equipo -> 201
    crear(data: UnidadEquipoCreateRequest): Promise<UnidadEquipo> {
        return apiFetch<UnidadEquipo>('/unidades-equipo', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT /api/unidades-equipo/{id} -> 200
    actualizar(id: number, data: UnidadEquipoUpdateRequest): Promise<UnidadEquipo> {
        return apiFetch<UnidadEquipo>(`/unidades-equipo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // DELETE /api/unidades-equipo/{id} -> 204 | 409 si tiene mantenimientos
    eliminar(id: number): Promise<void> {
        return apiFetch<void>(`/unidades-equipo/${id}`, {
            method: 'DELETE',
        });
    },
};
