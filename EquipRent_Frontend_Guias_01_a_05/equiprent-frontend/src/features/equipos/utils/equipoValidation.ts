import type { EquipoFormData } from '../types/EquipoFormData';

export type EquipoFormErrors = Partial<Record<keyof EquipoFormData, string>>;

const CODIGO_REGEX = /^[A-Za-z0-9-]+$/;

export function validarEquipo(data: EquipoFormData): EquipoFormErrors {
  const errors: EquipoFormErrors = {};

  if (!data.categoriaId) {
    errors.categoriaId = 'Debe seleccionar una categoría.';
  } else if (Number(data.categoriaId) <= 0) {
    errors.categoriaId = 'La categoría no es válida.';
  }

  if (!data.codigo.trim()) {
    errors.codigo = 'El código es obligatorio.';
  } else if (data.codigo.trim().length > 30) {
    errors.codigo = 'El código admite máximo 30 caracteres.';
  } else if (!CODIGO_REGEX.test(data.codigo.trim())) {
    errors.codigo = 'El código sólo admite letras, números y guiones.';
  }

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (data.nombre.trim().length > 120) {
    errors.nombre = 'El nombre admite máximo 120 caracteres.';
  }

  if (data.marca.trim().length > 60) errors.marca = 'La marca admite máximo 60 caracteres.';
  if (data.modelo.trim().length > 60) errors.modelo = 'El modelo admite máximo 60 caracteres.';

  return errors;
}
