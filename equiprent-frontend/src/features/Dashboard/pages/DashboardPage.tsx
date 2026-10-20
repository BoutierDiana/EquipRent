import { Link } from 'react-router';
import { MetricCard } from '../../../components/ui/MetricCard';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatDateTime } from '../../../shared/utils/dates';
import { useMantenimientos } from '../../Mantenimiento/hooks/useMantenimiento';
import { TIPO_MANTENIMIENTO_LABELS } from '../../Mantenimiento/models/Mantenimiento';
import { TIPO_MANTENIMIENTO_TONES } from '../../Mantenimiento/utils/mantenimientoFormat';
import { useUnidadesEquipo } from '../../UnidadEquipo/hooks/useUnidadesEquipo';

export default function DashboardPage() {
    const unidadesState = useUnidadesEquipo();
    const mantenimientosState = useMantenimientos();

    const unidades = unidadesState.data;
    const mantenimientos = mantenimientosState.data;
    const loading = unidadesState.loading || mantenimientosState.loading;
    const error = unidadesState.error || mantenimientosState.error;

    // Estado derivado: se calcula en cada render desde las colecciones; no se guarda en useState.
    const totalMaquinarias = unidades.length;
    const disponibles = unidades.filter((u) => u.estadoOperativo === 'DISPONIBLE').length;
    const enMantenimiento = unidades.filter((u) => u.estadoOperativo === 'EN_MANTENIMIENTO').length;
    const enUso = unidades.filter((u) => u.estadoOperativo === 'EN_USO').length;
    const ordenesAbiertas = mantenimientos.filter((m) => m.estado === 'EN_PROCESO');
    const correctivas = mantenimientos.filter((m) => m.tipo === 'CORRECTIVO').length;

    // Relación 1:N resuelta en memoria: serie de la unidad de cada orden abierta.
    const serieDe = new Map(unidades.map((u) => [u.id, u.numeroSerie]));
    const proximasSalidas = [...ordenesAbiertas]
        .sort((a, b) => new Date(a.fechaEgresoEstimada).getTime() - new Date(b.fechaEgresoEstimada).getTime())
        .slice(0, 5);

    if (loading) {
        return <div className="state-card loading" role="status">Cargando indicadores ejecutivos del sistema...</div>;
    }

    if (error) {
        return (
            <div className="state-card error alert alert--error" role="alert">
                Error al cargar métricas: {error}
            </div>
        );
    }

    return (
        <section className="feature-page page-stack">
            <div className="page-heading">
                <div>
                    <p className="eyebrow">RESUMEN GENERAL</p>
                    <h1>Dashboard Ejecutivo</h1>
                    <p>Indicadores clave del estado de la maquinaria y operaciones de taller.</p>
                </div>
            </div>

            <div className="metric-grid">
                <MetricCard label="Total de Maquinarias" value={totalMaquinarias} helper="Flota física registrada" color="var(--color-purple-400)" />
                <MetricCard label="Unidades Disponibles" value={disponibles} helper="Listas para renta" color="var(--color-lime)" />
                <MetricCard label="En Uso" value={enUso} helper="En operación con clientes" color="var(--color-info)" />
                <MetricCard label="En Mantenimiento" value={enMantenimiento} helper="Bloqueadas en taller" color="var(--color-warning)" />
                <MetricCard label="Órdenes en Proceso" value={ordenesAbiertas.length} helper="Trabajos de taller abiertos" color="var(--color-warning)" />
                <MetricCard label="Órdenes Correctivas" value={correctivas} helper="Histórico por fallas" color="var(--color-danger)" />
            </div>

            <section className="panel">
                <header className="panel__header">
                    <h2>Próximas salidas de taller</h2>
                    <Link className="panel__link" to="/mantenimientos">Ver todas las órdenes</Link>
                </header>

                {proximasSalidas.length === 0 ? (
                    <p className="muted">No hay órdenes en proceso.</p>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Orden</th>
                                <th>Serie</th>
                                <th>Tipo</th>
                                <th>Egreso estimado</th>
                            </tr>
                            </thead>
                            <tbody>
                            {proximasSalidas.map((m) => (
                                <tr key={m.id}>
                                    <td className="mono id-cell">#{m.id}</td>
                                    <td className="mono">{serieDe.get(m.unidadEquipoId) ?? `Unidad #${m.unidadEquipoId}`}</td>
                                    <td>
                                        <StatusBadge active tone={TIPO_MANTENIMIENTO_TONES[m.tipo]} text={TIPO_MANTENIMIENTO_LABELS[m.tipo]} />
                                    </td>
                                    <td className="mono">{formatDateTime(m.fechaEgresoEstimada)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </section>
    );
}
