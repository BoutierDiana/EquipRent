import { apiFetch } from '../../../api/apiClient';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import type { UnidadEquipoCreateRequest } from '../types/UnidadEquipoCreateRequest';

export const unidadEquipoService = {
    listar(signal?: AbortSignal): Promise<UnidadEquipo[]> {
        return apiFetch<UnidadEquipo[]>('/unidades-equipo', { signal });
    },

    obtenerPorId(id: number, signal?: AbortSignal): Promise<UnidadEquipo> {
        return apiFetch<UnidadEquipo>(`/unidades-equipo/${id}`, { signal });
    },

    crear(data: UnidadEquipoCreateRequest): Promise<UnidadEquipo> {
        return apiFetch<UnidadEquipo>('/unidades-equipo', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    actualizar(id: number, data: UnidadEquipoCreateRequest): Promise<UnidadEquipo> {
        return apiFetch<UnidadEquipo>(`/unidades-equipo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    eliminar(id: number): Promise<void> {
        return apiFetch<void>(`/unidades-equipo/${id}`, {
            method: 'DELETE',
        });
    },
};