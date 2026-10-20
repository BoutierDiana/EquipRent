import type { UnidadEquipo } from '../types/UnidadEquipo';
import { estadoOperativoLabel } from '../utils/unidadEquipoFormat';

interface UnidadEquipoCardProps {
    unidad?: UnidadEquipo;
}

/** Ficha resumida de una unidad (vista de detalle). */
export const UnidadEquipoCard = ({ unidad }: UnidadEquipoCardProps) => {
    return (
        <article className="detail-card">
            <h3>{unidad ? `Unidad #${unidad.id}` : 'Detalle de Unidad'}</h3>
            <p><strong>Nro. Serie:</strong> <span className="mono">{unidad?.numeroSerie ?? 'N/D'}</span></p>
            <p><strong>Equipo:</strong> {unidad ? `#${unidad.equipoId}` : 'N/D'}</p>
            <p><strong>Estado:</strong> {unidad ? estadoOperativoLabel(unidad.estadoOperativo) : 'N/D'}</p>
            <p><strong>Métrica de uso:</strong> {unidad?.metricaUsoAcumulada ?? 'N/D'}</p>
        </article>
    );
};
