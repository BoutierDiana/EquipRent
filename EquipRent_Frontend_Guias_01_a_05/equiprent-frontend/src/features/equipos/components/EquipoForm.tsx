import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Equipo } from '../models/Equipo';
import { equipoService } from '../services/equipoService';
import type { EquipoFormData } from '../types/EquipoFormData';
import { validarEquipo, type EquipoFormErrors } from '../utils/equipoValidation';

const initialEquipoForm: EquipoFormData = {
  categoriaId: '',
  codigo: '',
  nombre: '',
  marca: '',
  modelo: '',
  descripcion: '',
};

// Las categorías vienen de la semilla V2; cuando exista /api/categorias se cargarán por HTTP.
const categorias = [
  { id: 1, nombre: 'Herramientas eléctricas' },
  { id: 2, nombre: 'Audiovisual' },
  { id: 3, nombre: 'Maquinaria ligera' },
];

interface EquipoFormProps {
  onCreated?: (equipo: Equipo) => void;
}

export default function EquipoForm({ onCreated }: EquipoFormProps) {
  const [formData, setFormData] = useState<EquipoFormData>(initialEquipoForm);
  const [errors, setErrors] = useState<EquipoFormErrors>({});
  const [mensaje, setMensaje] = useState('');
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const limpiar = () => {
    setFormData(initialEquipoForm);
    setErrors({});
    setMensaje('');
    setApiError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje('');
    setApiError('');

    const validationErrors = validarEquipo(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // Conversión: el formulario es texto, el backend espera números y nulos
    const payload = {
      categoriaId: Number(formData.categoriaId),
      codigo: formData.codigo.trim().toUpperCase(),
      nombre: formData.nombre.trim(),
      marca: formData.marca.trim() || null,
      modelo: formData.modelo.trim() || null,
      descripcion: formData.descripcion.trim() || null,
    };

    try {
      setSubmitting(true);
      const creado = await equipoService.crear(payload);
      onCreated?.(creado);
      setFormData(initialEquipoForm);
      setMensaje(`Equipo ${creado.codigo} creado con id ${creado.id}.`);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'No se pudo crear el equipo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="entity-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>
          Categoría
          <select name="categoriaId" value={formData.categoriaId} onChange={handleChange}>
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {errors.categoriaId && <small className="field-error">{errors.categoriaId}</small>}
        </label>

        <label>
          Código
          <input name="codigo" value={formData.codigo} onChange={handleChange} placeholder="EQ-TAL-002" />
          {errors.codigo && <small className="field-error">{errors.codigo}</small>}
        </label>

        <label className="form-span-2">
          Nombre
          <input name="nombre" value={formData.nombre} onChange={handleChange} />
          {errors.nombre && <small className="field-error">{errors.nombre}</small>}
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

        <label className="form-span-2">
          Descripción
          <textarea name="descripcion" rows={2} value={formData.descripcion} onChange={handleChange} />
        </label>
      </div>

      {mensaje && <div className="form-success">{mensaje}</div>}
      {apiError && <div className="form-error">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={limpiar}>
          Limpiar
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar equipo'}
        </button>
      </div>
    </form>
  );
}
