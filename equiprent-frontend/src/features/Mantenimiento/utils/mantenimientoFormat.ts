import type { BadgeTone } from '../../../components/ui/StatusBadge';
import type { EstadoMantenimiento, TipoMantenimiento } from '../models/Mantenimiento';

export const ESTADO_MANTENIMIENTO_TONES: Record<EstadoMantenimiento, BadgeTone> = {
    EN_PROCESO: 'warning',
    COMPLETADO: 'success',
    CANCELADO: 'neutral',
};

export const TIPO_MANTENIMIENTO_TONES: Record<TipoMantenimiento, BadgeTone> = {
    PREVENTIVO: 'info',
    CORRECTIVO: 'danger',
};
