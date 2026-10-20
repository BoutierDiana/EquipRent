import { apiFetch } from '../../../api/apiClient';
import type { Mantenimiento } from '../models/Mantenimiento';
import type {
    MantenimientoCreateRequest,
    MantenimientoUpdateRequest,
} from '../types/MantenimientoCreateRequest';

export const mantenimientoService = {
    // GET /api/mantenimientos (todas las órdenes)
    listar(signal?: AbortSignal): Promise<Mantenimiento[]> {
        return apiFetch<Mantenimiento[]>('/mantenimientos', { signal });
    },

    // GET /api/mantenimientos/unidad-equipo/{id} (órdenes de una unidad: lado N de la relación)
    listarPorUnidad(unidadEquipoId: number, signal?: AbortSignal): Promise<Mantenimiento[]> {
        return apiFetch<Mantenimiento[]>(`/mantenimientos/unidad-equipo/${unidadEquipoId}`, { signal });
    },

    // GET /api/mantenimientos/{id}
    obtenerPorId(id: number, signal?: AbortSignal): Promise<Mantenimiento> {
        return apiFetch<Mantenimiento>(`/mantenimientos/${id}`, { signal });
    },

    // POST /api/mantenimientos -> 201
    crear(data: MantenimientoCreateRequest): Promise<Mantenimiento> {
        return apiFetch<Mantenimiento>('/mantenimientos', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT /api/mantenimientos/{id} -> 200 (puede reasignar la unidad)
    actualizar(id: number, data: MantenimientoUpdateRequest): Promise<Mantenimiento> {
        return apiFetch<Mantenimiento>(`/mantenimientos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // DELETE /api/mantenimientos/{id} -> 204
    eliminar(id: number): Promise<void> {
        return apiFetch<void>(`/mantenimientos/${id}`, {
            method: 'DELETE',
        });
    },
};
