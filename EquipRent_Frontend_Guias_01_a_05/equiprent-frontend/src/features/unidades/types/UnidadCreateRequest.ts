import type { EstadoUnidad } from '../models/UnidadEquipo';

/** Coincide con CrearUnidadEquipoRequest del backend. */
export interface UnidadCreateRequest {
  equipoId: number;
  codigoUnidad: string;
  numeroSerie: string | null;
  estado: EstadoUnidad;
  fechaAdquisicion: string | null;
  valorReferencial: number | null;
  observacion: string | null;
}
