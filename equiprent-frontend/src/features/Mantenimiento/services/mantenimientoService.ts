import { apiFetch } from '../../../api/apiClient';
import type { Mantenimiento } from '../models/Mantenimiento';
import type { MantenimientoRequest } from '../types/MantenimientoRequests';

export const mantenimientoService = {
    // GET /api/mantenimientos/unidad-equipo/{id} (endpoint existente en tu backend)
    listarPorUnidad(unidadEquipoId: number, signal?: AbortSignal): Promise<Mantenimiento[]> {
        return apiFetch<Mantenimiento[]>(`/mantenimientos/unidad-equipo/${unidadEquipoId}`, { signal });
    },

    // GET /api/mantenimientos/{id}
    obtenerPorId(id: number, signal?: AbortSignal): Promise<Mantenimiento> {
        return apiFetch<Mantenimiento>(`/mantenimientos/${id}`, { signal });
    },

    // POST /api/mantenimientos
    crear(data: MantenimientoRequest): Promise<Mantenimiento> {
        return apiFetch<Mantenimiento>('/mantenimientos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT /api/mantenimientos/{id}
    actualizar(id: number, data: MantenimientoRequest): Promise<Mantenimiento> {
        return apiFetch<Mantenimiento>(`/mantenimientos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // DELETE /api/mantenimientos/{id}
    eliminar(id: number): Promise<void> {
        return apiFetch<void>(`/mantenimientos/${id}`, {
            method: 'DELETE',
        });
    },
};