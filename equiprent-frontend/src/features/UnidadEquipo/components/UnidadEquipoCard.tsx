import type { UnidadEquipo } from '../types/UnidadEquipo';

interface UnidadEquipoCardProps {
    unidad?: UnidadEquipo;
}

export const UnidadEquipoCard = ({ unidad }: UnidadEquipoCardProps) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', margin: '8px 0' }}>
            <h3>{unidad ? `${unidad.marca} ${unidad.modelo}` : 'Detalle de Unidad'}</h3>
            <p><strong>Código:</strong> {unidad?.codigoInventario ?? 'N/D'}</p>
            <p><strong>Nro. Serie:</strong> {unidad?.numeroSerie ?? 'N/D'}</p>
            <p><strong>Estado:</strong> {unidad?.estadoOperativo ?? 'N/D'}</p>
        </div>
    );
};