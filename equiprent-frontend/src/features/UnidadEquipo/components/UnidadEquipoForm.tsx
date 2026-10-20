import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import { unidadEquipoService } from '../services/unidadEquipoService';
import type { UnidadEquipoCreateRequest } from '../types/UnidadEquipoCreateRequest';
import { validarUnidadEquipo, type UnidadEquipoFormErrors } from '../utils/unidadEquipoValidation';

interface UnidadEquipoFormProps {
    unidad?: UnidadEquipo | null;
    onSaved: (unidad: UnidadEquipo, mode: 'create' | 'edit') => void;
    onCancelEdit?: () => void;
}

export interface UnidadEquipoFormState {
    equipoId: string;
    codigoInventario: string;
    numeroSerie: string;
    marca: string;
    modelo: string;
    estadoOperativo: string;
    ubicacion: string;
    metricaUsoAcum: string;
    activo: boolean;
}

const initialForm: UnidadEquipoFormState = {
    equipoId: '1',
    codigoInventario: '',
    numeroSerie: '',
    marca: '',
    modelo: '',
    estadoOperativo: 'DISPONIBLE',
    ubicacion: '',
    metricaUsoAcum: '0',
    activo: true,
};

export default function UnidadEquipoForm({
                                             unidad,
                                             onSaved,
                                             onCancelEdit,
                                         }: UnidadEquipoFormProps) {
    const [formData, setFormData] = useState<UnidadEquipoFormState>(initialForm);
    const [errors, setErrors] = useState<UnidadEquipoFormErrors>({});
    const [mensaje, setMensaje] = useState('');
    const [apiError, setApiError] = useState('');
    const [saving, setSaving] = useState(false);

    const isEditing = Boolean(unidad);

    useEffect(() => {
        if (unidad) {
            setFormData({
                equipoId: String((unidad as any).equipoId ?? 1),
                codigoInventario: unidad.codigoInventario ?? '',
                numeroSerie: unidad.numeroSerie ?? '',
                marca: (unidad as any).marca ?? '',
                modelo: (unidad as any).modelo ?? '',
                estadoOperativo: (unidad as any).estadoOperativo ?? 'DISPONIBLE',
                ubicacion: (unidad as any).ubicacion ?? '',
                metricaUsoAcum: String((unidad as any).metricaUsoAcumulada ?? 0),
                activo: Boolean(unidad.activo),
            });
        } else {
            setFormData(initialForm);
        }
        setErrors({});
        setApiError('');
        setMensaje('');
    }, [unidad]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
        const { name, value } = target;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setFormData((prev) => ({ ...prev, [name]: target.checked }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje('');
        setApiError('');

        const validationErrors = validarUnidadEquipo(formData as any);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const payload: UnidadEquipoCreateRequest = {
            equipoId: Number(formData.equipoId),
            codigoInventario: formData.codigoInventario.trim().toUpperCase(),
            numeroSerie: formData.numeroSerie.trim().toUpperCase(),
            marca: formData.marca.trim(),
            modelo: formData.modelo.trim(),
            estadoOperativo: formData.estadoOperativo,
            ubicacion: formData.ubicacion.trim(),
            metricaUsoAcumulada: Number(formData.metricaUsoAcum),
            activo: formData.activo,
        };

        try {
            setSaving(true);
            if (unidad) {
                const actualizada = await unidadEquipoService.actualizar(unidad.id, payload);
                onSaved(actualizada, 'edit');
                setMensaje('Unidad actualizada exitosamente.');
            } else {
                const creada = await unidadEquipoService.crear(payload);
                onSaved(creada, 'create');
                setFormData(initialForm);
                setMensaje('Unidad creada exitosamente.');
            }
        } catch (err) {
            setApiError(err instanceof Error ? err.message : 'Error al procesar la solicitud');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form className="entity-form" onSubmit={handleSubmit} noValidate>
            <h3>{isEditing ? `Editar Unidad de Maquinaria #${unidad?.id}` : 'Registrar Nueva Unidad'}</h3>

            <div className="form-grid">
                <label>
                    ID de Equipo Maestro
                    <input
                        type="number"
                        name="equipoId"
                        value={formData.equipoId}
                        onChange={handleChange}
                        placeholder="1"
                    />
                </label>

                <label>
                    Métrica de Uso Inicial (Horas/Km)
                    <input
                        type="number"
                        name="metricaUsoAcum"
                        value={formData.metricaUsoAcum}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </label>

                <label>
                    Código de Inventario
                    <input
                        name="codigoInventario"
                        value={formData.codigoInventario}
                        onChange={handleChange}
                        placeholder="Ej. CAT-001"
                    />
                    {errors.codigoInventario && <small className="field-error">{errors.codigoInventario}</small>}
                </label>

                <label>
                    Número de Serie
                    <input
                        name="numeroSerie"
                        value={formData.numeroSerie}
                        onChange={handleChange}
                        placeholder="Nro de chasis o serie"
                    />
                    {errors.numeroSerie && <small className="field-error">{errors.numeroSerie}</small>}
                </label>

                <label>
                    Marca
                    <input name="marca" value={formData.marca} onChange={handleChange} />
                    {errors.marca && <small className="field-error">{errors.marca}</small>}
                </label>

                <label>
                    Modelo
                    <input name="modelo" value={formData.modelo} onChange={handleChange} />
                    {errors.modelo && <small className="field-error">{errors.modelo}</small>}
                </label>

                <label>
                    Estado Operativo
                    <select name="estadoOperativo" value={formData.estadoOperativo} onChange={handleChange}>
                        <option value="DISPONIBLE">DISPONIBLE</option>
                        <option value="EN_TALLER">EN TALLER</option>
                        <option value="EN_REVISION">EN REVISIÓN</option>
                    </select>
                    {errors.estadoOperativo && <small className="field-error">{errors.estadoOperativo}</small>}
                </label>

                <label>
                    Ubicación Física / Depósito
                    <input
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        placeholder="Ej. Taller Central"
                    />
                    {errors.ubicacion && <small className="field-error">{errors.ubicacion}</small>}
                </label>

                <label className="checkbox-field form-span-2">
                    <input
                        type="checkbox"
                        name="activo"
                        checked={formData.activo}
                        onChange={handleChange}
                    />
                    Unidad Vigente / Activa
                </label>
            </div>

            {apiError && (
                <div style={{ background: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '8px', marginTop: '12px' }}>
                    {apiError}
                </div>
            )}
            {mensaje && (
                <div style={{ background: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '8px', marginTop: '12px' }}>
                    {mensaje}
                </div>
            )}

            <div className="form-actions" style={{ display: 'flex', gap: '8px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                {isEditing && (
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={onCancelEdit}
                        disabled={saving}
                    >
                        Cancelar Edición
                    </button>
                )}
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                        setFormData(initialForm);
                        setErrors({});
                        setMensaje('');
                        setApiError('');
                    }}
                    disabled={saving}
                >
                    Limpiar
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : isEditing ? 'Actualizar Unidad' : 'Guardar Unidad'}
                </button>
            </div>
        </form>
    );
}