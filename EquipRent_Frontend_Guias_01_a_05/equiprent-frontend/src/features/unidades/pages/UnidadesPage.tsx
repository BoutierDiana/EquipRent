import { useEffect, useState } from 'react';
import type { Equipo } from '../../equipos/models/Equipo';
import { equipoService } from '../../equipos/services/equipoService';
import UnidadForm from '../components/UnidadForm';
import UnidadTable from '../components/UnidadTable';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import { unidadService } from '../services/unidadService';

export default function UnidadesPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipoId, setEquipoId] = useState('');
  const [unidades, setUnidades] = useState<UnidadEquipo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // 1) Cargar los equipos para el selector (padres reales, no mocks)
  useEffect(() => {
    const controller = new AbortController();

    void equipoService
      .listar(undefined, controller.signal)
      .then((data) => {
        setEquipos(data);
        if (data.length > 0) setEquipoId(String(data[0].id));
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los equipos');
      });

    return () => controller.abort();
  }, []);

  // 2) Cargar las unidades del equipo elegido: GET /api/unidades/equipo/{id}
  useEffect(() => {
    if (!equipoId) {
      setUnidades([]);
      return;
    }
    const controller = new AbortController();

    const cargarUnidades = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await unidadService.listarPorEquipo(Number(equipoId), controller.signal);
        setUnidades(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void cargarUnidades();
    return () => controller.abort();
  }, [equipoId]);

  const total = unidades.length;
  const disponibles = unidades.filter((unidad) => unidad.estado === 'DISPONIBLE').length;

  return (
    <section className="feature-page">
      <div className="page-heading page-heading--row">
        <div>
          <p className="eyebrow">ACTIVOS FÍSICOS</p>
          <h1>Unidades</h1>
          <p>Cada unidad pertenece a un equipo mediante la FK <code>equipoId</code>.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          {mostrarFormulario ? 'Cerrar formulario' : '+ Nueva unidad'}
        </button>
      </div>

      <div className="filter-bar">
        <label>
          Equipo
          <select value={equipoId} onChange={(e) => setEquipoId(e.target.value)}>
            <option value="">Seleccione un equipo</option>
            {equipos.map((equipo) => (
              <option key={equipo.id} value={equipo.id}>
                {equipo.codigo} · {equipo.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="stats-grid">
        <article className="stat-card"><span>Unidades</span><strong>{total}</strong></article>
        <article className="stat-card"><span>Disponibles</span><strong>{disponibles}</strong></article>
        <article className="stat-card"><span>No disponibles</span><strong>{total - disponibles}</strong></article>
      </div>

      {mostrarFormulario && (
        <UnidadForm
          equipos={equipos}
          equipoSeleccionadoId={equipoId}
          onCreated={(nueva) => {
            if (String(nueva.equipoId) === equipoId) {
              setUnidades((prev) => [...prev, nueva]);
            }
          }}
        />
      )}

      {loading && <div className="state-card">Cargando unidades...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && <UnidadTable unidades={unidades} equipos={equipos} />}
    </section>
  );
}
