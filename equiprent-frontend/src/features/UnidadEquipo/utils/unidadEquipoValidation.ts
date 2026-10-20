import type { UnidadEquipoFormData } from '../types/UnidadEquipoFormData';

export type UnidadEquipoFormErrors = Partial<Record<keyof UnidadEquipoFormData, string>>;

export function validarUnidadEquipo(data: UnidadEquipoFormData): UnidadEquipoFormErrors {
    const errors: UnidadEquipoFormErrors = {};

    if (!data.codigoInventario.trim()) {
        errors.codigoInventario = 'El código de inventario es obligatorio.';
    } else if (data.codigoInventario.trim().length < 4) {
        errors.codigoInventario = 'El código debe tener al menos 4 caracteres.';
    }

    if (!data.numeroSerie.trim()) {
        errors.numeroSerie = 'El número de serie es obligatorio.';
    } else if (data.numeroSerie.trim().length < 5) { // Regla práctica evaluada
        errors.numeroSerie = 'El número de serie debe tener al menos 5 caracteres.';
    }

    if (!data.marca.trim()) errors.marca = 'La marca es obligatoria.';
    if (!data.modelo.trim()) errors.modelo = 'El modelo es obligatorio.';
    if (!data.estadoOperativo.trim()) errors.estadoOperativo = 'Seleccione el estado operativo.';
    if (!data.ubicacion.trim()) errors.ubicacion = 'La ubicación física es obligatoria.';

    return errors;
}