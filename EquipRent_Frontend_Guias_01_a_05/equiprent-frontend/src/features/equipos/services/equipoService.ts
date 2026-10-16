import { apiFetch } from '../../../api/apiClient';
import type { Equipo } from '../models/Equipo';
import type { EquipoCreateRequest } from '../types/EquipoCreateRequest';

export const equipoService = {
  /** GET /api/equipos  (con filtro opcional por nombre) */
  listar(nombre?: string, signal?: AbortSignal): Promise<Equipo[]> {
    const query = nombre ? `?nombre=${encodeURIComponent(nombre)}` : '';
    return apiFetch<Equipo[]>(`/equipos${query}`, { signal });
  },

  /** GET /api/equipos/{id} */
  obtener(id: number, signal?: AbortSignal): Promise<Equipo> {
    return apiFetch<Equipo>(`/equipos/${id}`, { signal });
  },

  /** POST /api/equipos */
  crear(data: EquipoCreateRequest): Promise<Equipo> {
    return apiFetch<Equipo>('/equipos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
