import { MetricCard } from '../../../components/ui/MetricCard';
import { useUnidadesEquipo } from '../../UnidadEquipo/hooks/useUnidadesEquipo';

export default function DashboardPage() {
    const { data: unidades, loading: loadingUnidades, error: errorUnidades } = useUnidadesEquipo();

    // Estados derivados calculados en render sin duplicar useState
    const totalMaquinarias = unidades.length;
    const disponibles = unidades.filter(
        (u: any) => String(u.estadoOperativo).toUpperCase() === 'DISPONIBLE'
    ).length;
    const enMantenimiento = unidades.filter(
        (u: any) => String(u.estadoOperativo).toUpperCase() === 'EN_MANTENIMIENTO'
    ).length;
    const alquiladas = unidades.filter(
        (u: any) => String(u.estadoOperativo).toUpperCase() === 'ALQUILADO'
    ).length;

    if (loadingUnidades) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                Cargando indicadores ejecutivos del sistema...
            </div>
        );
    }

    if (errorUnidades) {
        return (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px' }}>
                Error al cargar métricas: {errorUnidades}
            </div>
        );
    }

    return (
        <section className="feature-page page-stack" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
                <p className="eyebrow" style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                    RESUMEN GENERAL
                </p>
                <h1 style={{ margin: '4px 0', fontSize: '1.8rem', color: '#0f172a' }}>
                    Dashboard Ejecutivo
                </h1>
                <p style={{ margin: 0, color: '#64748b' }}>
                    Indicadores clave del estado de la maquinaria y operaciones de taller.
                </p>
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '1rem',
                }}
            >
                <MetricCard
                    label="Total de Maquinarias"
                    value={totalMaquinarias}
                    helper="Flota física registrada"
                    color="#2563eb"
                />
                <MetricCard
                    label="Unidades Disponibles"
                    value={disponibles}
                    helper="Listas para renta"
                    color="#16a34a"
                />
                <MetricCard
                    label="En Mantenimiento"
                    value={enMantenimiento}
                    helper="En taller o servicio técnico"
                    color="#d97706"
                />
                <MetricCard
                    label="Alquiladas"
                    value={alquiladas}
                    helper="En operación con clientes"
                    color="#9333ea"
                />
            </div>
        </section>
    );
}