// Reglas de validación del formulario "Nueva Orden de Taller".
// Funciones puras: no dibujan nada ni guardan nada; solo reciben datos y
// devuelven los mensajes de error. Validar en el móvil mejora la experiencia,
// pero NO reemplaza la validación de Spring Boot (@Valid -> 400 Bad Request).

/** Valores del formulario tal como los escribe el usuario (texto). */
export type MantenimientoFormulario = {
    unidadEquipoId: number | null;
    fecha: string;
    descripcion: string;
    costo: string;
};

/** Un mensaje opcional por cada campo del formulario. */
export type ErroresMantenimiento = Partial<Record<keyof MantenimientoFormulario, string>>;

export const FORMULARIO_VACIO: MantenimientoFormulario = {
    unidadEquipoId: null,
    fecha: '',
    descripcion: '',
    costo: '',
};

export const MENSAJES = {
    unidad: 'Selecciona una unidad de equipo válida.',
    fecha: 'Usa el formato AAAA-MM-DD (ej. 2026-03-10).',
    descripcion: 'La descripción debe tener al menos 5 caracteres.',
    costo: 'El costo debe ser un número mayor a 0.',
} as const;

/** true si el texto tiene formato AAAA-MM-DD y además es una fecha real (no 2026-02-31). */
export function esFechaValida(texto: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        return false;
    }
    const [anio, mes, dia] = texto.split('-').map(Number);
    const fecha = new Date(Date.UTC(anio, mes - 1, dia));
    return (
        fecha.getUTCFullYear() === anio &&
        fecha.getUTCMonth() === mes - 1 &&
        fecha.getUTCDate() === dia
    );
}

/** Convierte el costo escrito a número; acepta coma o punto decimal. */
export function leerCosto(texto: string): number {
    const limpio = texto.trim().replace(',', '.');
    return limpio === '' ? Number.NaN : Number(limpio);
}

/**
 * Valida el formulario completo.
 * @param idsValidos ids de las unidades que realmente existen.
 */
export function validarMantenimiento(
    datos: MantenimientoFormulario,
    idsValidos: readonly number[]
): ErroresMantenimiento {
    const errores: ErroresMantenimiento = {};

    if (datos.unidadEquipoId === null || !idsValidos.includes(datos.unidadEquipoId)) {
        errores.unidadEquipoId = MENSAJES.unidad;
    }
    if (!esFechaValida(datos.fecha.trim())) {
        errores.fecha = MENSAJES.fecha;
    }
    if (datos.descripcion.trim().length < 5) {
        errores.descripcion = MENSAJES.descripcion;
    }
    const costo = leerCosto(datos.costo);
    if (!Number.isFinite(costo) || costo <= 0) {
        errores.costo = MENSAJES.costo;
    }

    return errores;
}

/** true si existe al menos un mensaje de error. */
export function tieneErrores(errores: ErroresMantenimiento): boolean {
    return Object.keys(errores).length > 0;
}