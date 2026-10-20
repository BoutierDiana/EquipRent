import type { Mantenimiento } from '../types/Mantenimiento';

interface MantenimientoCardProps {
    mantenimiento?: Mantenimiento;
}

export const MantenimientoCard = ({ mantenimiento }: MantenimientoCardProps) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', margin: '8px 0' }}>
            <h3>{mantenimiento ? `Mantenimiento #${mantenimiento.id ?? ''}` : 'Detalle de Mantenimiento'}</h3>
            <p><strong>Unidad ID:</strong> {mantenimiento?.unidadEquipoId ?? 'N/D'}</p>
            <p><strong>Fecha:</strong> {mantenimiento?.fecha ?? 'Sin fecha'}</p>
            <p><strong>Descripción:</strong> {mantenimiento?.descripcion ?? 'Sin descripción'}</p>
            <p><strong>Costo:</strong> ${mantenimiento?.costo ?? 0}</p>
        </div>
    );
};