import type { EstadoMantenimiento, TipoMantenimiento } from '../models/Mantenimiento';

/** Cuerpo de POST /api/mantenimientos (CrearMantenimientoRequest en el backend). */
export interface MantenimientoCreateRequest {
    unidadEquipoId: number;
    danoId?: number | null;
    tipo: TipoMantenimiento;
    fechaIngreso: string;
    fechaEgresoEstimada: string;
    fechaEgresoReal?: string | null;
    estado: EstadoMantenimiento;
}

/** Cuerpo de PUT /api/mantenimientos/{id}: misma forma, nombrado por intención. */
export type MantenimientoUpdateRequest = MantenimientoCreateRequest;
