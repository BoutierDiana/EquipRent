import type { BadgeTone } from '../../../components/ui/StatusBadge';
import { ESTADO_OPERATIVO_LABELS, type EstadoOperativo, type UnidadEquipo } from '../models/UnidadEquipo';

export const ESTADO_OPERATIVO_TONES: Record<EstadoOperativo, BadgeTone> = {
    DISPONIBLE: 'success',
    RESERVADA: 'info',
    EN_USO: 'info',
    EN_MANTENIMIENTO: 'warning',
    DE_BAJA: 'danger',
};

export const estadoOperativoLabel = (estado: EstadoOperativo): string =>
    ESTADO_OPERATIVO_LABELS[estado] ?? estado;

/** Texto descriptivo de la unidad padre para selectores y tablas (no solo el id). */
export const describirUnidad = (unidad: UnidadEquipo): string =>
    `${unidad.numeroSerie} · Equipo #${unidad.equipoId}`;
