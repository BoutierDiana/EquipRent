import { useEffect, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Button } from '../../../components/ui/Button';
import { ESTADOS_OPERATIVOS, type EstadoOperativo, type UnidadEquipo } from '../models/UnidadEquipo';
import { unidadEquipoService } from '../services/unidadEquipoService';
import type { UnidadEquipoCreateRequest } from '../types/UnidadEquipoCreateRequest';
import type { UnidadEquipoFormData } from '../types/UnidadEquipoFormData';
import { estadoOperativoLabel } from '../utils/unidadEquipoFormat';
import { validarUnidadEquipo, type UnidadEquipoFormErrors } from '../utils/unidadEquipoValidation';

interface UnidadEquipoFormProps {
    unidad?: UnidadEquipo | null;
    onSaved: (unidad: UnidadEquipo, mode: 'create' | 'edit') => void;
    onCancelEdit?: () => void;
}

const initialForm: UnidadEquipoFormData = {
    equipoId: '1',
    numeroSerie: '',
    estadoOperativo: 'DISPONIBLE',
    metricaUsoAcumulada: '0',
    notasEstado: '',
    activo: true,
};

const toFormData = (unidad: UnidadEquipo): UnidadEquipoFormData => ({
    equipoId: String(unidad.equipoId),
    numeroSerie: unidad.numeroSerie,
    estadoOperativo: unidad.estadoOperativo,
    metricaUsoAcumulada: String(unidad.metricaUsoAcumulada),
    notasEstado: unidad.notasEstado ?? '',
    activo: unidad.activo,
});

export default function UnidadEquipoForm({
                                             unidad,
                                             onSaved,
                                             onCancelEdit,
                                         }: UnidadEquipoFormProps) {
    const [formData, setFormData] = useState<UnidadEquipoFormData>(initialForm);
    const [errors, setErrors] = useState<UnidadEquipoFormErrors>({});
    const [mensaje, setMensaje] = useState('');
    const [apiError, setApiError] = useState('');
    const [saving, setSaving] = useState(false);

    const isEditing = Boolean(unidad);

    // Sincroniza el estado editable cuando cambia la unidad a editar (no hace HTTP).
    useEffect(() => {
        setFormData(unidad ? toFormData(unidad) : initialForm);
        setErrors({});
        setApiError('');
        setMensaje('');
    }, [unidad]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

        const validationErrors = validarUnidadEquipo(formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        // Conversión a tipos de dominio solo después de validar.
        const payload: UnidadEquipoCreateRequest = {
            equipoId: Number(formData.equipoId),
            numeroSerie: formData.numeroSerie.trim().toUpperCase(),
            estadoOperativo: formData.estadoOperativo as EstadoOperativo,
            metricaUsoAcumulada: Number(formData.metricaUsoAcumulada),
            notasEstado: formData.notasEstado.trim() || null,
        };

        try {
            setSaving(true);
            if (unidad) {
                const actualizada = await unidadEquipoService.actualizar(unidad.id, {
                    ...payload,
                    activo: formData.activo,
                });
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

    const limpiar = () => {
        setFormData(isEditing && unidad ? toFormData(unidad) : initialForm);
        setErrors({});
        setMensaje('');
        setApiError('');
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
                        min={1}
                        value={formData.equipoId}
                        onChange={handleChange}
                        placeholder="1"
                    />
                    {errors.equipoId && <small className="field-error">{errors.equipoId}</small>}
                </label>

                <label>
                    Número de Serie
                    <input
                        name="numeroSerie"
                        className="mono"
                        value={formData.numeroSerie}
                        onChange={handleChange}
                        placeholder="Ej. SN-MAK-000124"
                    />
                    {errors.numeroSerie && <small className="field-error">{errors.numeroSerie}</small>}
                </label>

                <label>
                    Estado Operativo
                    <select name="estadoOperativo" value={formData.estadoOperativo} onChange={handleChange}>
                        {ESTADOS_OPERATIVOS.map((estado) => (
                            <option key={estado} value={estado}>
                                {estadoOperativoLabel(estado)}
                            </option>
                        ))}
                    </select>
                    {errors.estadoOperativo && <small className="field-error">{errors.estadoOperativo}</small>}
                </label>

                <label>
                    Métrica de Uso Acumulada (Horas/Km)
                    <input
                        type="number"
                        name="metricaUsoAcumulada"
                        min={0}
                        step="0.01"
                        value={formData.metricaUsoAcumulada}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    {errors.metricaUsoAcumulada && (
                        <small className="field-error">{errors.metricaUsoAcumulada}</small>
                    )}
                </label>

                <label className="form-span-2">
                    Notas de Estado
                    <textarea
                        name="notasEstado"
                        rows={2}
                        value={formData.notasEstado}
                        onChange={handleChange}
                        placeholder="Observaciones mecánicas o estéticas (opcional)"
                    />
                </label>

                {isEditing && (
                    <label className="checkbox-field form-span-2">
                        <input
                            type="checkbox"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                        />
                        Unidad Vigente / Activa
                    </label>
                )}
            </div>

            {apiError && <div className="alert alert--error" role="alert">{apiError}</div>}
            {mensaje && <div className="alert alert--success" role="status">{mensaje}</div>}

            <div className="form-actions">
                {isEditing && (
                    <Button variant="secondary" onClick={onCancelEdit} disabled={saving}>
                        Cancelar Edición
                    </Button>
                )}
                <Button variant="ghost" onClick={limpiar} disabled={saving}>
                    Limpiar
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? 'Guardando...' : isEditing ? 'Actualizar Unidad' : 'Guardar Unidad'}
                </Button>
            </div>
        </form>
    );
}
