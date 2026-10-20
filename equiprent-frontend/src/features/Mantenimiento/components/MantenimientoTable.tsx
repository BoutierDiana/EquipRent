import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import type { Mantenimiento } from '../models/Mantenimiento';

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
    // Construcción de mapa en memoria O(1) para evitar el problema N+1
    const unidadMap = new Map<number, UnidadEquipo>(
        unidades.map((u) => [u.id, u]),
    );

    const getUnidadInfo = (item: any) => {
        const unidadId = item.unidadEquipoId ?? item.unidadEquipo?.id;
        const u = unidadMap.get(unidadId);
        if (u) {
            return `${u.codigoInventario} (${u.marca} ${u.modelo})`;
        }
        return unidadId ? `Unidad #${unidadId}` : '—';
    };

    const formatearFecha = (fechaStr?: string | null) => {
        if (!fechaStr) return '—';
        try {
            return new Date(fechaStr).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        } catch {
            return String(fechaStr);
        }
    };

    if (mantenimientos.length === 0) {
        return (
            <div className="state-card empty" style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px' }}>
                No hay órdenes de mantenimiento para el criterio seleccionado.
            </div>
        );
    }

    return (
        <div className="table-wrapper" style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Maquinaria (1:N)</th>
                    <th style={{ padding: '10px' }}>Tipo</th>
                    <th style={{ padding: '10px' }}>Estado</th>
                    <th style={{ padding: '10px' }}>Ingreso</th>
                    <th style={{ padding: '10px' }}>Egreso Est.</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {mantenimientos.map((item: any) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px' }}><strong>#{item.id}</strong></td>
                        <td style={{ padding: '10px' }}>{getUnidadInfo(item)}</td>
                        <td style={{ padding: '10px' }}>
                <span
                    style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        background: item.tipo === 'PREVENTIVO' ? '#e0f2fe' : '#fef3c7',
                        color: item.tipo === 'PREVENTIVO' ? '#0369a1' : '#b45309',
                    }}
                >
                  {item.tipo ?? '—'}
                </span>
                        </td>
                        <td style={{ padding: '10px' }}>
                <span
                    style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                        background: item.estado === 'COMPLETADO' ? '#dcfce7' : '#f3f4f6',
                        color: item.estado === 'COMPLETADO' ? '#15803d' : '#374151',
                    }}
                >
                  {item.estado ?? '—'}
                </span>
                        </td>
                        <td style={{ padding: '10px' }}>{formatearFecha(item.fechaIngreso)}</td>
                        <td style={{ padding: '10px' }}>{formatearFecha(item.fechaEgresoEstimada)}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => onEdit(item.id)}
                                    style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                                >
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(item)}
                                    disabled={deletingId === item.id}
                                    style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer' }}
                                >
                                    {deletingId === item.id ? '...' : 'Eliminar'}
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}