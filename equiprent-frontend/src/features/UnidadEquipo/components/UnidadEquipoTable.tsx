import type { UnidadEquipo } from '../models/UnidadEquipo';

interface UnidadEquipoTableProps {
    unidades: UnidadEquipo[];
    onEdit: (id: number) => void;
    onDelete: (unidad: UnidadEquipo) => void;
    deletingId?: number | null;
}

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
                    <th>Código</th>
                    <th>Serie</th>
                    <th>Estado</th>
                    <th>Métrica Uso</th>
                    <th>Vigente</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {unidades.map((u) => (
                    <tr key={u.id}>
                        <td><strong>#{u.id}</strong></td>
                        <td>{u.codigoInventario}</td>
                        <td>{u.numeroSerie}</td>
                        <td>
                <span className={`badge estado-${(u as any).estadoOperativo?.toLowerCase() || 'disponible'}`}>
                  {(u as any).estadoOperativo || 'DISPONIBLE'}
                </span>
                        </td>
                        <td>{(u as any).metricaUsoAcumulada ?? 0} hrs/km</td>
                        <td>{u.activo ? 'Sí' : 'No'}</td>
                        <td className="actions-cell" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button
                                type="button"
                                className="btn-action edit"
                                onClick={() => onEdit(u.id)}
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                className="btn-action delete"
                                onClick={() => onDelete(u)}
                                disabled={deletingId === u.id}
                            >
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