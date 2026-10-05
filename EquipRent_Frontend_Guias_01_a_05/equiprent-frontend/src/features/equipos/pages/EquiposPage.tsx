import { useEffect, useState } from 'react';
import EquipoForm from '../components/EquipoForm';
import EquipoTable from '../components/EquipoTable';
import type { Equipo } from '../models/Equipo';
import { equipoService } from '../services/equipoService';

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const cargarEquipos = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await equipoService.listar(undefined, controller.signal);
        setEquipos(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error inesperado');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void cargarEquipos();
    return () => controller.abort();
  }, []);

  const total = equipos.length;
  const activos = equipos.filter((equipo) => equipo.activo).length;

  return (
    <section className="feature-page">
      <div className="page-heading page-heading--row">
        <div>
          <p className="eyebrow">CATÁLOGO</p>
          <h1>Equipos</h1>
          <p>Modelos del catálogo que luego se registran como unidades físicas.</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setMostrarFormulario((prev) => !prev)}
        >
          {mostrarFormulario ? 'Cerrar formulario' : '+ Nuevo equipo'}
        </button>
      </div>

      <div className="stats-grid">
        <article className="stat-card"><span>Total</span><strong>{total}</strong></article>
        <article className="stat-card"><span>Activos</span><strong>{activos}</strong></article>
        <article className="stat-card"><span>Inactivos</span><strong>{total - activos}</strong></article>
      </div>

      {mostrarFormulario && (
        <EquipoForm onCreated={(nuevo) => setEquipos((prev) => [...prev, nuevo])} />
      )}

      {loading && <div className="state-card">Cargando equipos...</div>}
      {!loading && error && <div className="state-card error">{error}</div>}
      {!loading && !error && <EquipoTable equipos={equipos} />}
    </section>
  );
}
