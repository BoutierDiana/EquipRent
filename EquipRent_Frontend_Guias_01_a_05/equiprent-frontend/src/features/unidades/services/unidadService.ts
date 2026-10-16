import { apiFetch } from '../../../api/apiClient';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import type { UnidadCreateRequest } from '../types/UnidadCreateRequest';

export const unidadService = {
  /** GET /api/unidades/equipo/{equipoId} — las unidades de un equipo (relación 1:N) */
  listarPorEquipo(equipoId: number, signal?: AbortSignal): Promise<UnidadEquipo[]> {
    return apiFetch<UnidadEquipo[]>(`/unidades/equipo/${equipoId}`, { signal });
  },

  /** GET /api/unidades/{id} */
  obtener(id: number, signal?: AbortSignal): Promise<UnidadEquipo> {
    return apiFetch<UnidadEquipo>(`/unidades/${id}`, { signal });
  },

  /** POST /api/unidades */
  crear(data: UnidadCreateRequest): Promise<UnidadEquipo> {
    return apiFetch<UnidadEquipo>('/unidades', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
