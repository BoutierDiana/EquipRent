/** Coincide con el enum EstadoUnidad y con ck_unidad_equipo_estado. */
export type EstadoUnidad =
  | 'DISPONIBLE'
  | 'ENTREGADA'
  | 'EN_INSPECCION'
  | 'MANTENIMIENTO'
  | 'BLOQUEADA'
  | 'BAJA';

/** Estados con los que el backend permite dar de alta una unidad. */
export const ESTADOS_ALTA: EstadoUnidad[] = ['DISPONIBLE', 'MANTENIMIENTO'];

/**
 * Contrato que expone el backend en UnidadEquipoResponse.
 * equipoId materializa la relación 1:N (FK unidad_equipo.equipo_id).
 */
export interface UnidadEquipo {
  id: number;
  equipoId: number;
  codigoUnidad: string;
  numeroSerie: string | null;
  estado: EstadoUnidad;
  fechaAdquisicion: string | null;
  valorReferencial: number | null;
  observacion: string | null;
}
