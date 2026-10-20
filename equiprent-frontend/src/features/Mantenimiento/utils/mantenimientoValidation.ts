import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import { ESTADOS_MANTENIMIENTO, TIPOS_MANTENIMIENTO } from '../models/Mantenimiento';
import type { MantenimientoFormData } from '../types/MantenimientoRequests';

export type MantenimientoFormErrors = Partial<Record<keyof MantenimientoFormData, string>>;

const incluye = (lista: readonly string[], valor: string) => lista.includes(valor);

/**
 * Valida el formulario antes de construir el payload (Guía 04 y 07).
 * Recibe las unidades cargadas para comprobar que la referencia al padre existe:
 * mejora la experiencia, pero el backend vuelve a validarlo (404).
 */
export function validarMantenimiento(
    data: MantenimientoFormData,
    unidades: UnidadEquipo[],
): MantenimientoFormErrors {
    const errors: MantenimientoFormErrors = {};

    const unidadId = Number(data.unidadEquipoId);
    if (!data.unidadEquipoId) {
        errors.unidadEquipoId = 'Debe seleccionar una unidad de maquinaria.';
    } else if (!unidades.some((u) => u.id === unidadId)) {
        errors.unidadEquipoId = 'La unidad seleccionada no existe.';
    }

    if (!incluye(TIPOS_MANTENIMIENTO, data.tipo)) {
        errors.tipo = 'Seleccione PREVENTIVO o CORRECTIVO.';
    }

    if (!incluye(ESTADOS_MANTENIMIENTO, data.estado)) {
        errors.estado = 'Seleccione un estado válido.';
    }

    const ingreso = data.fechaIngreso ? new Date(data.fechaIngreso) : null;
    const egresoEstimada = data.fechaEgresoEstimada ? new Date(data.fechaEgresoEstimada) : null;
    const egresoReal = data.fechaEgresoReal ? new Date(data.fechaEgresoReal) : null;

    if (!ingreso || Number.isNaN(ingreso.getTime())) {
        errors.fechaIngreso = 'La fecha de ingreso es obligatoria.';
    }

    if (!egresoEstimada || Number.isNaN(egresoEstimada.getTime())) {
        errors.fechaEgresoEstimada = 'La fecha de egreso estimada es obligatoria.';
    } else if (ingreso && egresoEstimada < ingreso) {
        errors.fechaEgresoEstimada = 'El egreso estimado no puede ser anterior al ingreso.';
    }

    if (egresoReal && ingreso && egresoReal < ingreso) {
        errors.fechaEgresoReal = 'El egreso real no puede ser anterior al ingreso.';
    }

    return errors;
}
