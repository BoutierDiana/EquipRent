import { formatDateTime } from '../../../shared/utils/dates';
import { ESTADO_MANTENIMIENTO_LABELS, TIPO_MANTENIMIENTO_LABELS } from '../models/Mantenimiento';
import type { Mantenimiento } from '../types/Mantenimiento';

interface MantenimientoCardProps {
    mantenimiento?: Mantenimiento;
}

/** Ficha resumida de una orden (vista de detalle). */
export const MantenimientoCard = ({ mantenimiento }: MantenimientoCardProps) => {
    return (
        <article className="detail-card">
            <h3>{mantenimiento ? `Mantenimiento #${mantenimiento.id}` : 'Detalle de Mantenimiento'}</h3>
            <p><strong>Unidad ID:</strong> {mantenimiento?.unidadEquipoId ?? 'N/D'}</p>
            <p><strong>Tipo:</strong> {mantenimiento ? TIPO_MANTENIMIENTO_LABELS[mantenimiento.tipo] : 'N/D'}</p>
            <p><strong>Estado:</strong> {mantenimiento ? ESTADO_MANTENIMIENTO_LABELS[mantenimiento.estado] : 'N/D'}</p>
            <p><strong>Ingreso:</strong> {formatDateTime(mantenimiento?.fechaIngreso)}</p>
        </article>
    );
};
