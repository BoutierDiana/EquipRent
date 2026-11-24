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
export function tieneErrores(errores: ErroresMantenimiento | ErroresUnidad): boolean {
    return Object.keys(errores).length > 0;
}

// ---------------------------------------------------------------------------
// Guía 05: formulario de UnidadEquipo (lado 1 de la relación).
// ---------------------------------------------------------------------------

/** Catálogo de estados operativos (CHECK ck_unidad_equipo_estado_operativo en PostgreSQL). */
export const ESTADOS_OPERATIVOS = [
    'DISPONIBLE',
    'RESERVADA',
    'EN_USO',
    'EN_MANTENIMIENTO',
    'DE_BAJA',
] as const;

export type EstadoOperativo = (typeof ESTADOS_OPERATIVOS)[number];

/** Valores del formulario de unidad tal como los escribe el usuario. */
export type UnidadFormulario = {
    codigoInventario: string;
    numeroSerie: string;
    marca: string;
    modelo: string;
    estadoOperativo: string;
    activo: boolean;
};

export type ErroresUnidad = Partial<
    Record<'codigoInventario' | 'numeroSerie' | 'marca' | 'modelo' | 'estadoOperativo', string>
>;

export const UNIDAD_VACIA: UnidadFormulario = {
    codigoInventario: '',
    numeroSerie: '',
    marca: '',
    modelo: '',
    estadoOperativo: 'DISPONIBLE',
    activo: true,
};

export const MENSAJES_UNIDAD = {
    codigo: 'Usa el formato EQ-000 (ej. EQ-005).',
    codigoDuplicado: 'Ya existe otra unidad con ese código de inventario.',
    serie: 'El número de serie debe tener al menos 4 caracteres.',
    serieDuplicada: 'Ya existe otra unidad con ese número de serie.',
    marca: 'La marca debe tener al menos 2 caracteres.',
    modelo: 'El modelo debe tener al menos 2 caracteres.',
    estado: 'Selecciona un estado operativo del catálogo.',
} as const;

/** "eq-5 " -> "EQ-5" : el código y la serie se guardan siempre en mayúsculas. */
export const normalizarCodigo = (texto: string): string => texto.trim().toUpperCase();

/** Registro mínimo para comprobar duplicados (id + campos únicos). */
type UnidadExistente = { id: number; codigoInventario: string; numeroSerie: string };

/**
 * Valida el formulario de unidad.
 * @param existentes unidades ya registradas (para impedir códigos o series repetidos).
 * @param idActual id de la unidad que se edita; se excluye de la comprobación de duplicados.
 */
export function validarUnidad(
    datos: UnidadFormulario,
    existentes: readonly UnidadExistente[],
    idActual: number | null = null
): ErroresUnidad {
    const errores: ErroresUnidad = {};
    const otras = existentes.filter((u) => u.id !== idActual);
    const codigo = normalizarCodigo(datos.codigoInventario);
    const serie = normalizarCodigo(datos.numeroSerie);

    if (!/^EQ-\d{3,5}$/.test(codigo)) {
        errores.codigoInventario = MENSAJES_UNIDAD.codigo;
    } else if (otras.some((u) => u.codigoInventario === codigo)) {
        errores.codigoInventario = MENSAJES_UNIDAD.codigoDuplicado;
    }
    if (serie.length < 4) {
        errores.numeroSerie = MENSAJES_UNIDAD.serie;
    } else if (otras.some((u) => u.numeroSerie === serie)) {
        errores.numeroSerie = MENSAJES_UNIDAD.serieDuplicada;
    }
    if (datos.marca.trim().length < 2) {
        errores.marca = MENSAJES_UNIDAD.marca;
    }
    if (datos.modelo.trim().length < 2) {
        errores.modelo = MENSAJES_UNIDAD.modelo;
    }
    if (!(ESTADOS_OPERATIVOS as readonly string[]).includes(datos.estadoOperativo)) {
        errores.estadoOperativo = MENSAJES_UNIDAD.estado;
    }
    return errores;
}
