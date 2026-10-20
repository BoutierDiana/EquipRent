import type { MantenimientoFormData } from '../types/MantenimientoFormData';

export type MantenimientoFormErrors = Partial<Record<keyof MantenimientoFormData, string>>;

export function validarMantenimiento(data: MantenimientoFormData): MantenimientoFormErrors {
    const errors: MantenimientoFormErrors = {};
    const costoNum = Number(data.costo);

    if (!data.unidadEquipoId) {
        errors.unidadEquipoId = 'Debe seleccionar una unidad de maquinaria.';
    }

    if (!data.fecha.trim()) {
        errors.fecha = 'La fecha de servicio es obligatoria.';
    }

    if (!data.descripcion.trim()) {
        errors.descripcion = 'La descripción del servicio es obligatoria.';
    } else if (data.descripcion.trim().length < 8) {
        errors.descripcion = 'La descripción debe tener al menos 8 caracteres explicativos.';
    }

    if (!data.costo.trim()) {
        errors.costo = 'El costo es obligatorio.';
    } else if (isNaN(costoNum) || costoNum < 0) {
        errors.costo = 'Ingrese un monto de costo numérico válido.';
    }

    if (!data.tipoMantenimiento) {
        errors.tipoMantenimiento = 'Debe indicar si es Preventivo o Correctivo.';
    }

    return errors;
}