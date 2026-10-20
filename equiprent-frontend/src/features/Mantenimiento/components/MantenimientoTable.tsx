import { Icon } from '../../../components/ui/Icon';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatDateTime } from '../../../shared/utils/dates';
import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import {
    ESTADO_MANTENIMIENTO_LABELS,
    TIPO_MANTENIMIENTO_LABELS,
    type Mantenimiento,
} from '../models/Mantenimiento';
import { ESTADO_MANTENIMIENTO_TONES, TIPO_MANTENIMIENTO_TONES } from '../utils/mantenimientoFormat';

interface MantenimientoTableProps {
    mantenimientos: Mantenimiento[];
    unidades: UnidadEquipo[];
    onEdit: (id: number) => void;
    onDelete: (mantenimiento: Mantenimiento) => void;
    deletingId?: number | null;
}

export default function MantenimientoTable({
                                               mantenimientos,
                                               unidades,
                                               onEdit,
                                               onDelete,
                                               deletingId,
                                           }: MantenimientoTableProps) {
    // Mapa en memoria O(1): resuelve la unidad padre sin un GET por fila (evita N+1)
    const unidadMap = new Map<number, UnidadEquipo>(unidades.map((u) => [u.id, u]));

    if (mantenimientos.length === 0) {
        return (
            <div className="state-card empty">
                No hay órdenes de mantenimiento para el criterio seleccionado.
            </div>
        );
    }

    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Maquinaria (1:N)</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Ingreso</th>
                    <th>Egreso Est.</th>
                    <th>Egreso Real</th>
                    <th className="actions-col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {mantenimientos.map((item) => {
                    const unidad = unidadMap.get(item.unidadEquipoId);
                    return (
                        <tr key={item.id}>
                            <td className="mono id-cell">#{item.id}</td>
                            <td>
                                {unidad ? (
                                    <span className="mono">{unidad.numeroSerie}</span>
                                ) : (
                                    <span className="muted">Unidad #{item.unidadEquipoId}</span>
                                )}
                            </td>
                            <td>
                                <StatusBadge
                                    active
                                    tone={TIPO_MANTENIMIENTO_TONES[item.tipo]}
                                    text={TIPO_MANTENIMIENTO_LABELS[item.tipo]}
                                />
                            </td>
                            <td>
                                <StatusBadge
                                    active={item.estado === 'COMPLETADO'}
                                    tone={ESTADO_MANTENIMIENTO_TONES[item.estado]}
                                    text={ESTADO_MANTENIMIENTO_LABELS[item.estado]}
                                />
                            </td>
                            <td className="mono">{formatDateTime(item.fechaIngreso)}</td>
                            <td className="mono">{formatDateTime(item.fechaEgresoEstimada)}</td>
                            <td className="mono">{formatDateTime(item.fechaEgresoReal)}</td>
                            <td className="actions-cell">
                                <button type="button" className="btn-action edit" onClick={() => onEdit(item.id)}>
                                    <Icon name="edit" size={15} />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    className="btn-action delete"
                                    onClick={() => onDelete(item)}
                                    disabled={deletingId === item.id}
                                >
                                    <Icon name="trash" size={15} />
                                    {deletingId === item.id ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
