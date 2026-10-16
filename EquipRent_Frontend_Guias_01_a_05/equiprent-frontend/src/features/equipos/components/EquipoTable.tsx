import type { Equipo } from '../models/Equipo';

interface EquipoTableProps {
  equipos: Equipo[];
}

export default function EquipoTable({ equipos }: EquipoTableProps) {
  if (equipos.length === 0) {
    return <div className="empty-state">No hay equipos registrados.</div>;
  }

  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Equipo</th>
              <th>Marca / Modelo</th>
              <th>Categoría</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo) => (
              <tr key={equipo.id}>
                <td>{equipo.id}</td>
                <td className="code-cell">{equipo.codigo}</td>
                <td>{equipo.nombre}</td>
                <td>{[equipo.marca, equipo.modelo].filter(Boolean).join(' ') || '—'}</td>
                <td>{equipo.categoriaId}</td>
                <td>
                  <span className={`status-badge ${equipo.activo ? 'status-active' : 'status-inactive'}`}>
                    {equipo.activo ? 'Activo' : 'Inactivo'}
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
