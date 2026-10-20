import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import type { Mantenimiento } from '../models/Mantenimiento';
import { mantenimientoService } from '../services/mantenimientoService';
import type { MantenimientoFormData, MantenimientoRequest } from '../types/MantenimientoRequests';

interface MantenimientoFormProps {
    unidades: UnidadEquipo[];
    mantenimiento?: Mantenimiento | null;
    onSaved: (mantenimiento: Mantenimiento, mode: 'create' | 'edit') => void;
    onCancelEdit?: () => void;
}

const initialForm: MantenimientoFormData = {
    unidadEquipoId: '',
    tipo: 'PREVENTIVO',
    estado: 'PROGRAMADO',
    descripcion: '',
    costo: '0',
    fechaIngreso: new Date().toISOString().slice(0, 16),
    fechaEgresoEstimada: '',
};

export default function MantenimientoForm({
                                              unidades,
                                              mantenimiento,
                                              onSaved,
                                              onCancelEdit,
                                          }: MantenimientoFormProps) {
    const [formData, setFormData] = useState<MantenimientoFormData>(initialForm);
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState('');

    const isEditing = Boolean(mantenimiento);

    useEffect(() => {
        if (mantenimiento) {
            setFormData({
                unidadEquipoId: String((mantenimiento as any).unidadEquipoId ?? (mantenimiento as any).unidadEquipo?.id ?? ''),
                tipo: (mantenimiento as any).tipoMantenimiento ?? (mantenimiento as any).tipo ?? 'PREVENTIVO',
                estado: (mantenimiento as any).estado ?? 'PROGRAMADO',
                descripcion: (mantenimiento as any).descripcion ?? '',
                costo: String((mantenimiento as any).costo ?? '0'),
                fechaIngreso: (mantenimiento as any).fechaIngreso ? (mantenimiento as any).fechaIngreso.slice(0, 16) : '',
                fechaEgresoEstimada: (mantenimiento as any).fechaEgresoEstimada ? (mantenimiento as any).fechaEgresoEstimada.slice(0, 16) : '',
            });
        } else {
            setFormData(initialForm);
        }
        setApiError('');
    }, [mantenimiento]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError('');

        if (!formData.unidadEquipoId) {
            setApiError('Debe seleccionar una unidad de maquinaria.');
            return;
        }

        const payload: MantenimientoRequest = {
            unidadEquipoId: Number(formData.unidadEquipoId),
            tipo: formData.tipo,
            estado: formData.estado,
            descripcion: formData.descripcion.trim(),
            costo: Number(formData.costo) || 0,
            fechaIngreso: formData.fechaIngreso ? new Date(formData.fechaIngreso).toISOString() : new Date().toISOString(),
            fechaEgresoEstimada: formData.fechaEgresoEstimada ? new Date(formData.fechaEgresoEstimada).toISOString() : new Date().toISOString(),
        };

        try {
            setSaving(true);
            if (mantenimiento) {
                const actualizado = await mantenimientoService.actualizar(mantenimiento.id, payload);
                onSaved(actualizado, 'edit');
            } else {
                const creado = await mantenimientoService.crear(payload);
                onSaved(creado, 'create');
                setFormData(initialForm);
            }
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Error al guardar la orden');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
            <h3>{isEditing ? `Editar Orden de Mantenimiento #${mantenimiento?.id}` : 'Nueva Orden de Mantenimiento'}</h3>

            <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {/* Selector controlado de la entidad padre */}
                <label>
                    Maquinaria Asignada (*)
                    <select
                        name="unidadEquipoId"
                        value={formData.unidadEquipoId}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="">-- Seleccione una maquinaria --</option>
                        {unidades.map((u) => (
                            <option key={u.id} value={String(u.id)}>
                                {u.codigoInventario} - {u.numeroSerie} ({u.marca} {u.modelo})
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Tipo de Servicio
                    <select
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="PREVENTIVO">PREVENTIVO</option>
                        <option value="CORRECTIVO">CORRECTIVO</option>
                        <option value="INSPECCION">INSPECCIÓN</option>
                    </select>
                </label>

                <label>
                    Estado de la Orden
                    <select
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    >
                        <option value="PROGRAMADO">PROGRAMADO</option>
                        <option value="EN_PROCESO">EN PROCESO</option>
                        <option value="COMPLETADO">COMPLETADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                    </select>
                </label>

                <label>
                    Costo Estimado ($)
                    <input
                        type="number"
                        name="costo"
                        value={formData.costo}
                        onChange={handleChange}
                        step="0.01"
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                </label>

                <label>
                    Fecha Ingreso
                    <input
                        type="datetime-local"
                        name="fechaIngreso"
                        value={formData.fechaIngreso}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                </label>

                <label>
                    Fecha Egreso Estimada
                    <input
                        type="datetime-local"
                        name="fechaEgresoEstimada"
                        value={formData.fechaEgresoEstimada}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    />
                </label>
            </div>

            <label style={{ display: 'block', marginTop: '1rem' }}>
                Descripción del Trabajo
                <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Detalle de fallas o trabajos a realizar..."
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                />
            </label>

            {apiError && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '6px', marginTop: '1rem' }}>
                    {apiError}
                </div>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                {isEditing && (
                    <button type="button" onClick={onCancelEdit} disabled={saving} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff' }}>
                        Cancelar
                    </button>
                )}
                <button type="submit" disabled={saving} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600 }}>
                    {saving ? 'Guardando...' : isEditing ? 'Actualizar Orden' : 'Guardar Orden'}
                </button>
            </div>
        </form>
    );
}