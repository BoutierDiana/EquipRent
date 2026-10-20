import { ESTADOS_OPERATIVOS } from '../models/UnidadEquipo';
import type { UnidadEquipoFormData } from '../types/UnidadEquipoFormData';

export type UnidadEquipoFormErrors = Partial<Record<keyof UnidadEquipoFormData, string>>;

const esEstadoValido = (valor: string): boolean =>
    (ESTADOS_OPERATIVOS as readonly string[]).includes(valor);

export function validarUnidadEquipo(data: UnidadEquipoFormData): UnidadEquipoFormErrors {
    const errors: UnidadEquipoFormErrors = {};

    const equipoId = Number(data.equipoId);
    if (!data.equipoId.trim()) {
        errors.equipoId = 'El ID de equipo es obligatorio.';
    } else if (!Number.isInteger(equipoId) || equipoId <= 0) {
        errors.equipoId = 'El ID de equipo debe ser un entero positivo.';
    }

    const serie = data.numeroSerie.trim();
    if (!serie) {
        errors.numeroSerie = 'El número de serie es obligatorio.';
    } else if (serie.length < 5 || serie.length > 50) {
        errors.numeroSerie = 'El número de serie debe tener entre 5 y 50 caracteres.';
    }

    if (!esEstadoValido(data.estadoOperativo)) {
        errors.estadoOperativo = 'Seleccione un estado operativo válido.';
    }

    const metrica = Number(data.metricaUsoAcumulada);
    if (!data.metricaUsoAcumulada.trim()) {
        errors.metricaUsoAcumulada = 'La métrica de uso es obligatoria.';
    } else if (Number.isNaN(metrica) || metrica < 0) {
        errors.metricaUsoAcumulada = 'La métrica de uso debe ser un número mayor o igual a 0.';
    }

    return errors;
}
