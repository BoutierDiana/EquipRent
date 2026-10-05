import type { Equipo } from '../../equipos/models/Equipo';
import type { EstadoUnidad, UnidadEquipo } from '../models/UnidadEquipo';

interface UnidadTableProps {
  unidades: UnidadEquipo[];
  equipos: Equipo[];
}

const claseEstado: Record<EstadoUnidad, string> = {
  DISPONIBLE: 'status-active',
  ENTREGADA: 'status-busy',
  EN_INSPECCION: 'status-warning',
  MANTENIMIENTO: 'status-warning',
  BLOQUEADA: 'status-inactive',
  BAJA: 'status-inactive',
};

export default function UnidadTable({ unidades, equipos }: UnidadTableProps) {
  // Convierte la FK equipoId en algo legible; así se ve la relación 1:N
  const obtenerNombreEquipo = (equipoId: number) => {
    const equipo = equipos.find((item) => item.id === equipoId);
    return equipo ? `${equipo.codigo} · ${equipo.nombre}` : 'Sin equipo asociado';
  };

  if (unidades.length === 0) {
    return <div className="empty-state">Este equipo todavía no tiene unidades registradas.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Código de unidad</th>
              <th>Equipo</th>
              <th>Número de serie</th>
              <th>Adquisición</th>
              <th>Valor ref.</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((unidad) => (
              <tr key={unidad.id}>
                <td className="code-cell">{unidad.codigoUnidad}</td>
                <td>{obtenerNombreEquipo(unidad.equipoId)}</td>
                <td>{unidad.numeroSerie ?? '—'}</td>
                <td>{unidad.fechaAdquisicion ?? '—'}</td>
                <td>
                  {unidad.valorReferencial !== null
                    ? unidad.valorReferencial.toFixed(2)
                    : '—'}
                </td>
                <td>
                  <span className={`status-badge ${claseEstado[unidad.estado]}`}>
                    {unidad.estado.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
