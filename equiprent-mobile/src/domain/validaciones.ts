import { codigoOcupado, serieOcupada } from './equiprentRules';

// Reglas de validación del formulario "Nueva Orden de Taller".
// Funciones puras: no dibujan nada ni guardan nada; solo reciben datos y
// devuelven los mensajes de error. Validar en el móvil mejora la experiencia,
// pero NO reemplaza la validación de Spring Boot (@Valid -> 400 Bad Request).

/** Catálogo de tipos de mantenimiento (mismo CHECK que en PostgreSQL). */
export const TIPOS_MANTENIMIENTO = ['PREVENTIVO', 'CORRECTIVO'] as const;

/** Valores del formulario tal como los escribe el usuario (texto). */
export type MantenimientoFormulario = {
    unidadEquipoId: number | null;
    tipoMantenimiento: string;
    fecha: string;
    descripcion: string;
    costo: string;
};

/** Un mensaje opcional por cada campo del formulario. */
export type ErroresMantenimiento = Partial<Record<keyof MantenimientoFormulario, string>>;

export const FORMULARIO_VACIO: MantenimientoFormulario = {
    unidadEquipoId: null,
    tipoMantenimiento: 'PREVENTIVO',
    fecha: '',
    descripcion: '',
    costo: '',
};

export const MENSAJES = {
    unidad: 'Selecciona una unidad de equipo válida.',
    tipo: 'Selecciona PREVENTIVO o CORRECTIVO.',
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
    if (!(TIPOS_MANTENIMIENTO as readonly string[]).includes(datos.tipoMantenimiento)) {
        errores.tipoMantenimiento = MENSAJES.tipo;
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
export function tieneErrores(errores: object): boolean {
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
    const codigo = normalizarCodigo(datos.codigoInventario);
    const serie = normalizarCodigo(datos.numeroSerie);

    if (!/^EQ-\d{3,5}$/.test(codigo)) {
        errores.codigoInventario = MENSAJES_UNIDAD.codigo;
    } else if (codigoOcupado(codigo, existentes, idActual ?? undefined)) {
        errores.codigoInventario = MENSAJES_UNIDAD.codigoDuplicado;
    }
    if (serie.length < 4) {
        errores.numeroSerie = MENSAJES_UNIDAD.serie;
    } else if (serieOcupada(serie, existentes, idActual ?? undefined)) {
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


// ---------------------------------------------------------------------------
// Guía 09: formulario de UnidadEquipo REMOTA (contrato de Spring Boot).
// Repite las reglas de @Valid del backend para avisar ANTES de enviar;
// el backend vuelve a validar y su respuesta 400/409 manda.
// ---------------------------------------------------------------------------

export type UnidadRemotaFormulario = {
    equipoId: number | null;
    numeroSerie: string;
    estadoOperativo: string;
    metricaUsoAcumulada: string; // texto mientras se escribe
    notasEstado: string;
    activo: boolean;
};

export type ErroresUnidadRemota = Partial<
    Record<'equipoId' | 'numeroSerie' | 'estadoOperativo' | 'metricaUsoAcumulada', string>
>;

export const UNIDAD_REMOTA_VACIA: UnidadRemotaFormulario = {
    equipoId: null,
    numeroSerie: '',
    estadoOperativo: 'DISPONIBLE',
    metricaUsoAcumulada: '0',
    notasEstado: '',
    activo: true,
};

export const MENSAJES_UNIDAD_REMOTA = {
    equipo: 'Selecciona un equipo del catálogo.',
    serie: 'El número de serie debe tener entre 5 y 50 caracteres.',
    estado: MENSAJES_UNIDAD.estado,
    metrica: 'La métrica de uso debe ser un número mayor o igual a 0.',
} as const;

/** Valida igual que CrearUnidadEquipoRequest / ActualizarUnidadEquipoRequest. */
export function validarUnidadRemota(
    datos: UnidadRemotaFormulario,
    idsEquipos: readonly number[]
): ErroresUnidadRemota {
    const errores: ErroresUnidadRemota = {};
    if (datos.equipoId === null || !idsEquipos.includes(datos.equipoId)) {
        errores.equipoId = MENSAJES_UNIDAD_REMOTA.equipo;
    }
    const serie = normalizarCodigo(datos.numeroSerie);
    if (serie.length < 5 || serie.length > 50) {
        errores.numeroSerie = MENSAJES_UNIDAD_REMOTA.serie;
    }
    if (!(ESTADOS_OPERATIVOS as readonly string[]).includes(datos.estadoOperativo)) {
        errores.estadoOperativo = MENSAJES_UNIDAD_REMOTA.estado;
    }
    const metrica = leerCosto(datos.metricaUsoAcumulada); // mismo parseo decimal (coma o punto)
    if (!Number.isFinite(metrica) || metrica < 0) {
        errores.metricaUsoAcumulada = MENSAJES_UNIDAD_REMOTA.metrica;
    }
    return errores;
}


// ---------------------------------------------------------------------------
// Guía 10: formulario de Mantenimiento REMOTO (contrato de /api/mantenimientos).
// ---------------------------------------------------------------------------

/** Catálogo de estados de una orden (CHECK ck_mantenimiento_estado). */
export const ESTADOS_MANTENIMIENTO = ['EN_PROCESO', 'COMPLETADO', 'CANCELADO'] as const;

export type MantenimientoRemotoFormulario = {
    unidadEquipoId: number | null;
    tipo: string;
    fechaIngreso: string; // AAAA-MM-DD
    fechaEgresoEstimada: string; // AAAA-MM-DD
    fechaEgresoReal: string; // AAAA-MM-DD o '' (todavía no salió del taller)
    estado: string;
};

export type ErroresMantenimientoRemoto = Partial<Record<keyof MantenimientoRemotoFormulario, string>>;

export const MANTENIMIENTO_REMOTO_VACIO: MantenimientoRemotoFormulario = {
    unidadEquipoId: null,
    tipo: 'PREVENTIVO',
    fechaIngreso: '',
    fechaEgresoEstimada: '',
    fechaEgresoReal: '',
    estado: 'EN_PROCESO',
};

export const MENSAJES_MANTENIMIENTO_REMOTO = {
    unidad: MENSAJES.unidad,
    tipo: MENSAJES.tipo,
    fecha: MENSAJES.fecha,
    egresoAnterior: 'No puede ser anterior a la fecha de ingreso.',
    estado: 'Selecciona EN PROCESO, COMPLETADO o CANCELADO.',
} as const;

/**
 * Repite las reglas del backend: @Valid de Crear/ActualizarMantenimientoRequest
 * y la regla de dominio FechasMantenimientoInvalidasException (egreso >= ingreso).
 * Las fechas 'AAAA-MM-DD' se comparan como texto: ese formato ordena igual que el calendario.
 */
export function validarMantenimientoRemoto(
    datos: MantenimientoRemotoFormulario,
    idsUnidades: readonly number[]
): ErroresMantenimientoRemoto {
    const errores: ErroresMantenimientoRemoto = {};
    if (datos.unidadEquipoId === null || !idsUnidades.includes(datos.unidadEquipoId)) {
        errores.unidadEquipoId = MENSAJES_MANTENIMIENTO_REMOTO.unidad;
    }
    if (!(TIPOS_MANTENIMIENTO as readonly string[]).includes(datos.tipo)) {
        errores.tipo = MENSAJES_MANTENIMIENTO_REMOTO.tipo;
    }
    if (!(ESTADOS_MANTENIMIENTO as readonly string[]).includes(datos.estado)) {
        errores.estado = MENSAJES_MANTENIMIENTO_REMOTO.estado;
    }

    const ingreso = datos.fechaIngreso.trim();
    const estimada = datos.fechaEgresoEstimada.trim();
    const real = datos.fechaEgresoReal.trim();
    const ingresoValido = esFechaValida(ingreso);

    if (!ingresoValido) errores.fechaIngreso = MENSAJES_MANTENIMIENTO_REMOTO.fecha;
    if (!esFechaValida(estimada)) {
        errores.fechaEgresoEstimada = MENSAJES_MANTENIMIENTO_REMOTO.fecha;
    } else if (ingresoValido && estimada < ingreso) {
        errores.fechaEgresoEstimada = MENSAJES_MANTENIMIENTO_REMOTO.egresoAnterior;
    }
    if (real !== '') {
        if (!esFechaValida(real)) errores.fechaEgresoReal = MENSAJES_MANTENIMIENTO_REMOTO.fecha;
        else if (ingresoValido && real < ingreso) {
            errores.fechaEgresoReal = MENSAJES_MANTENIMIENTO_REMOTO.egresoAnterior;
        }
    }
    return errores;
}
