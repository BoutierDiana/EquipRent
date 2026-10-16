import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Equipo } from '../../equipos/models/Equipo';
import { ESTADOS_ALTA, type EstadoUnidad, type UnidadEquipo } from '../models/UnidadEquipo';
import { unidadService } from '../services/unidadService';
import type { UnidadFormData } from '../types/UnidadFormData';
import { validarUnidad, type UnidadFormErrors } from '../utils/unidadValidation';

const initialUnidadForm: UnidadFormData = {
  equipoId: '',
  codigoUnidad: '',
  numeroSerie: '',
  estado: 'DISPONIBLE',
  fechaAdquisicion: '',
  valorReferencial: '',
  observacion: '',
};

interface UnidadFormProps {
  equipos: Equipo[];
  equipoSeleccionadoId?: string;
  onCreated?: (unidad: UnidadEquipo) => void;
}

export default function UnidadForm({ equipos, equipoSeleccionadoId, onCreated }: UnidadFormProps) {
  const [formData, setFormData] = useState<UnidadFormData>({
    ...initialUnidadForm,
    equipoId: equipoSeleccionadoId ?? '',
  });
  const [errors, setErrors] = useState<UnidadFormErrors>({});
  const [mensaje, setMensaje] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setFormData({ ...initialUnidadForm, equipoId: equipoSeleccionadoId ?? '' });
    setErrors({});
    setMensaje('');
    setApiError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setApiError('');

    const validationErrors = validarUnidad(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      equipoId: Number(formData.equipoId),
      codigoUnidad: formData.codigoUnidad.trim().toUpperCase(),
      numeroSerie: formData.numeroSerie.trim() || null,
      estado: formData.estado as EstadoUnidad,
      fechaAdquisicion: formData.fechaAdquisicion || null,
      valorReferencial: formData.valorReferencial ? Number(formData.valorReferencial) : null,
      observacion: formData.observacion.trim() || null,
    };

    try {
      setSubmitting(true);
      const creada = await unidadService.crear(payload);
      onCreated?.(creada);
      limpiar();
      setMensaje(`Unidad ${creada.codigoUnidad} creada con id ${creada.id}.`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'No se pudo crear la unidad');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Equipo propietario
          <select name="equipoId" value={formData.equipoId} onChange={handleChange}>
            <option value="">Seleccione un equipo</option>
            {equipos
              .filter((equipo) => equipo.activo)
              .map((equipo) => (
                <option key={equipo.id} value={equipo.id}>
                  {equipo.codigo} · {equipo.nombre}
                </option>
              ))}
          </select>
          {errors.equipoId && <small className="field-error">{errors.equipoId}</small>}
        </label>

        <label>
          Código de unidad
          <input name="codigoUnidad" value={formData.codigoUnidad} onChange={handleChange} placeholder="UN-TAL-001-03" />
          {errors.codigoUnidad && <small className="field-error">{errors.codigoUnidad}</small>}
        </label>

        <label>
          Número de serie
          <input name="numeroSerie" value={formData.numeroSerie} onChange={handleChange} />
          {errors.numeroSerie && <small className="field-error">{errors.numeroSerie}</small>}
        </label>

        <label>
          Estado inicial
          <select name="estado" value={formData.estado} onChange={handleChange}>
            {ESTADOS_ALTA.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          {errors.estado && <small className="field-error">{errors.estado}</small>}
        </label>

        <label>
          Fecha de adquisición
          <input type="date" name="fechaAdquisicion" value={formData.fechaAdquisicion} onChange={handleChange} />
          {errors.fechaAdquisicion && <small className="field-error">{errors.fechaAdquisicion}</small>}
        </label>

        <label>
          Valor referencial (Bs)
          <input type="number" step="0.01" name="valorReferencial" value={formData.valorReferencial} onChange={handleChange} />
          {errors.valorReferencial && <small className="field-error">{errors.valorReferencial}</small>}
        </label>

        <label className="form-span-2">
          Observación
          <textarea name="observacion" rows={2} value={formData.observacion} onChange={handleChange} />
        </label>
      </div>

      {mensaje && <div className="form-success">{mensaje}</div>}
      {apiError && <div className="form-error">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={limpiar}>
          Limpiar
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar unidad'}
        </button>
      </div>
    </form>
  );
}
