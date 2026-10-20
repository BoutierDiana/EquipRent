import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { datetimeLocalToIso, isoToDatetimeLocal, nowDatetimeLocal } from '../../../shared/utils/dates';
import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import { describirUnidad } from '../../UnidadEquipo/utils/unidadEquipoFormat';
import {
    ESTADO_MANTENIMIENTO_LABELS,
    ESTADOS_MANTENIMIENTO,
    TIPO_MANTENIMIENTO_LABELS,
    TIPOS_MANTENIMIENTO,
    type EstadoMantenimiento,
    type Mantenimiento,
    type TipoMantenimiento,
} from '../models/Mantenimiento';
import { mantenimientoService } from '../services/mantenimientoService';
import type { MantenimientoFormData, MantenimientoRequest } from '../types/MantenimientoRequests';
import { validarMantenimiento, type MantenimientoFormErrors } from '../utils/mantenimientoValidation';

interface MantenimientoFormProps {
    unidades: UnidadEquipo[];
    mantenimiento?: Mantenimiento | null;
    onSaved: (mantenimiento: Mantenimiento, mode: 'create' | 'edit') => void;
    onCancelEdit?: () => void;
}

const buildInitialForm = (): MantenimientoFormData => ({
    unidadEquipoId: '',
    tipo: 'PREVENTIVO',
    estado: 'EN_PROCESO',
    fechaIngreso: nowDatetimeLocal(),
    fechaEgresoEstimada: '',
    fechaEgresoReal: '',
});

const toFormData = (m: Mantenimiento): MantenimientoFormData => ({
    unidadEquipoId: String(m.unidadEquipoId),
    tipo: m.tipo,
    estado: m.estado,
    fechaIngreso: isoToDatetimeLocal(m.fechaIngreso),
    fechaEgresoEstimada: isoToDatetimeLocal(m.fechaEgresoEstimada),
    fechaEgresoReal: isoToDatetimeLocal(m.fechaEgresoReal),
});

export default function MantenimientoForm({
                                              unidades,
                                              mantenimiento,
                                              onSaved,
                                              onCancelEdit,
                                          }: MantenimientoFormProps) {
    const [formData, setFormData] = useState<MantenimientoFormData>(buildInitialForm);
    const [errors, setErrors] = useState<MantenimientoFormErrors>({});
    const [saving, setSaving] = useState(false);
    const [apiError, setApiError] = useState('');

    const isEditing = Boolean(mantenimiento);

    // Sincroniza el formulario con la orden a editar (no dispara HTTP).
    useEffect(() => {
        setFormData(mantenimiento ? toFormData(mantenimiento) : buildInitialForm());
        setErrors({});
        setApiError('');
    }, [mantenimiento]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError('');

        // Valida también que la unidad padre exista entre las cargadas (Guía 07).
        const validationErrors = validarMantenimiento(formData, unidades);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const payload: MantenimientoRequest = {
            unidadEquipoId: Number(formData.unidadEquipoId),
            danoId: mantenimiento?.danoId ?? null,
            tipo: formData.tipo as TipoMantenimiento,
            estado: formData.estado as EstadoMantenimiento,
            fechaIngreso: datetimeLocalToIso(formData.fechaIngreso),
            fechaEgresoEstimada: datetimeLocalToIso(formData.fechaEgresoEstimada),
            fechaEgresoReal: formData.fechaEgresoReal ? datetimeLocalToIso(formData.fechaEgresoReal) : null,
        };

        try {
            setSaving(true);
            if (mantenimiento) {
                const actualizado = await mantenimientoService.actualizar(mantenimiento.id, payload);
                onSaved(actualizado, 'edit');
            } else {
                const creado = await mantenimientoService.crear(payload);
                onSaved(creado, 'create');
                setFormData(buildInitialForm());
            }
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Error al guardar la orden');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} noValidate>
            <h3>{isEditing ? `Editar Orden de Mantenimiento #${mantenimiento?.id}` : 'Nueva Orden de Mantenimiento'}</h3>

            <div className="form-grid">
                {/* Selector controlado de la entidad padre: muestra la serie, envía el id */}
                <label className="form-span-2">
                    Maquinaria Asignada (*)
                    <select
                        name="unidadEquipoId"
                        value={formData.unidadEquipoId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Seleccione una maquinaria --</option>
                        {unidades.map((u) => (
                            <option key={u.id} value={String(u.id)}>
                                {describirUnidad(u)}
                            </option>
                        ))}
                    </select>
                    {errors.unidadEquipoId && <small className="field-error">{errors.unidadEquipoId}</small>}
                </label>

                <label>
                    Tipo de Servicio
                    <select name="tipo" value={formData.tipo} onChange={handleChange}>
                        {TIPOS_MANTENIMIENTO.map((tipo) => (
                            <option key={tipo} value={tipo}>{TIPO_MANTENIMIENTO_LABELS[tipo]}</option>
                        ))}
                    </select>
                    {errors.tipo && <small className="field-error">{errors.tipo}</small>}
                </label>

                <label>
                    Estado de la Orden
                    <select name="estado" value={formData.estado} onChange={handleChange}>
                        {ESTADOS_MANTENIMIENTO.map((estado) => (
                            <option key={estado} value={estado}>{ESTADO_MANTENIMIENTO_LABELS[estado]}</option>
                        ))}
                    </select>
                    {errors.estado && <small className="field-error">{errors.estado}</small>}
                </label>

                <label>
                    Fecha Ingreso
                    <input
                        type="datetime-local"
                        name="fechaIngreso"
                        value={formData.fechaIngreso}
                        onChange={handleChange}
                    />
                    {errors.fechaIngreso && <small className="field-error">{errors.fechaIngreso}</small>}
                </label>

                <label>
                    Fecha Egreso Estimada
                    <input
                        type="datetime-local"
                        name="fechaEgresoEstimada"
                        value={formData.fechaEgresoEstimada}
                        onChange={handleChange}
                    />
                    {errors.fechaEgresoEstimada && (
                        <small className="field-error">{errors.fechaEgresoEstimada}</small>
                    )}
                </label>

                <label>
                    Fecha Egreso Real (opcional)
                    <input
                        type="datetime-local"
                        name="fechaEgresoReal"
                        value={formData.fechaEgresoReal}
                        onChange={handleChange}
                    />
                    {errors.fechaEgresoReal && <small className="field-error">{errors.fechaEgresoReal}</small>}
                </label>
            </div>

            {apiError && <div className="alert alert--error" role="alert">{apiError}</div>}

            <div className="form-actions">
                {isEditing && (
                    <Button variant="secondary" onClick={onCancelEdit} disabled={saving}>
                        Cancelar
                    </Button>
                )}
                <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Guardando...' : isEditing ? 'Actualizar Orden' : 'Guardar Orden'}
                </Button>
            </div>
        </form>
    );
}
