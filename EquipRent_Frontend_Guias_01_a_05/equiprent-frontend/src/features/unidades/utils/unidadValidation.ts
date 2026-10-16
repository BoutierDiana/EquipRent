import { ESTADOS_ALTA, type EstadoUnidad } from '../models/UnidadEquipo';
import type { UnidadFormData } from '../types/UnidadFormData';

export type UnidadFormErrors = Partial<Record<keyof UnidadFormData, string>>;

const CODIGO_REGEX = /^[A-Za-z0-9-]+$/;

export function validarUnidad(data: UnidadFormData): UnidadFormErrors {
  const errors: UnidadFormErrors = {};
  const hoy = new Date().toISOString().slice(0, 10);

  if (!data.equipoId) errors.equipoId = 'Debe seleccionar un equipo.';

  if (!data.codigoUnidad.trim()) {
    errors.codigoUnidad = 'El código de unidad es obligatorio.';
  } else if (data.codigoUnidad.trim().length > 40) {
    errors.codigoUnidad = 'El código admite máximo 40 caracteres.';
  } else if (!CODIGO_REGEX.test(data.codigoUnidad.trim())) {
    errors.codigoUnidad = 'El código sólo admite letras, números y guiones.';
  }

  if (data.numeroSerie.trim().length > 80) {
    errors.numeroSerie = 'El número de serie admite máximo 80 caracteres.';
  }

  if (!ESTADOS_ALTA.includes(data.estado as EstadoUnidad)) {
    errors.estado = 'Una unidad nueva sólo nace DISPONIBLE o en MANTENIMIENTO.';
  }

  if (data.fechaAdquisicion && data.fechaAdquisicion > hoy) {
    errors.fechaAdquisicion = 'La fecha de adquisición no puede ser futura.';
  }

  if (data.valorReferencial) {
    const valor = Number(data.valorReferencial);
    if (Number.isNaN(valor)) {
      errors.valorReferencial = 'El valor debe ser numérico.';
    } else if (valor < 0) {
      errors.valorReferencial = 'El valor no puede ser negativo.';
    } else if (!/^\d{1,10}(\.\d{1,2})?$/.test(data.valorReferencial.trim())) {
      errors.valorReferencial = 'Formato NUMERIC(12,2): máx. 10 enteros y 2 decimales.';
    }
  }

  return errors;
}
