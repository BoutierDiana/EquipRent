import { Icon } from '../../../components/ui/Icon';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import { ESTADO_OPERATIVO_TONES, estadoOperativoLabel } from '../utils/unidadEquipoFormat';

interface UnidadEquipoTableProps {
    unidades: UnidadEquipo[];
    onEdit: (id: number) => void;
    onDelete: (unidad: UnidadEquipo) => void;
    deletingId?: number | null;
}

const formatoMetrica = new Intl.NumberFormat('es-BO', { maximumFractionDigits: 2 });

export default function UnidadEquipoTable({
                                              unidades,
                                              onEdit,
                                              onDelete,
                                              deletingId,
                                          }: UnidadEquipoTableProps) {
    if (unidades.length === 0) {
        return <div className="state-card empty">No hay unidades de maquinaria registradas.</div>;
    }

    return (
        <div className="table-wrapper">
            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Serie</th>
                    <th>Equipo</th>
                    <th>Estado</th>
                    <th className="num">Métrica Uso</th>
                    <th>Notas</th>
                    <th>Vigente</th>
                    <th className="actions-col">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {unidades.map((u) => (
                    <tr key={u.id}>
                        <td className="mono id-cell">#{u.id}</td>
                        <td className="mono">{u.numeroSerie}</td>
                        <td className="mono">#{u.equipoId}</td>
                        <td>
                            <StatusBadge
                                active={u.estadoOperativo === 'DISPONIBLE'}
                                tone={ESTADO_OPERATIVO_TONES[u.estadoOperativo]}
                                text={estadoOperativoLabel(u.estadoOperativo)}
                            />
                        </td>
                        <td className="num mono">{formatoMetrica.format(u.metricaUsoAcumulada)} h/km</td>
                        <td className="notes-cell">{u.notasEstado ?? '—'}</td>
                        <td><StatusBadge active={u.activo} text={u.activo ? 'Sí' : 'No'} /></td>
                        <td className="actions-cell">
                            <button
                                type="button"
                                className="btn-action edit"
                                onClick={() => onEdit(u.id)}
                            >
                                <Icon name="edit" size={15} />
                                Editar
                            </button>
                            <button
                                type="button"
                                className="btn-action delete"
                                onClick={() => onDelete(u)}
                                disabled={deletingId === u.id}
                            >
                                <Icon name="trash" size={15} />
                                {deletingId === u.id ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
