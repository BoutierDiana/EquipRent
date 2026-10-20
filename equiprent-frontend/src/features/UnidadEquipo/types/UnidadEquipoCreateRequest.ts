import type { EstadoOperativo } from '../models/UnidadEquipo';

/** Cuerpo de POST /api/unidades-equipo (CrearUnidadEquipoRequest en el backend). */
export interface UnidadEquipoCreateRequest {
    equipoId: number;
    numeroSerie: string;
    estadoOperativo: EstadoOperativo;
    metricaUsoAcumulada: number;
    notasEstado: string | null;
}

/**
 * Cuerpo de PUT /api/unidades-equipo/{id} (ActualizarUnidadEquipoRequest).
 * Se nombra por intención aunque hoy solo agrega "activo".
 */
export interface UnidadEquipoUpdateRequest extends UnidadEquipoCreateRequest {
    activo: boolean;
}
