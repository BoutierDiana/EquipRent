import type { MantenimientoRemotoFormulario } from '../../domain/validaciones';
import { aOffsetDateTime } from '../../utils/formato';
import { requestHttp } from './apiClient';

/**
 * DTO REMOTO (Guía 10): forma EXACTA del JSON de Spring Boot (record MantenimientoResponse).
 * Lado N de la relación: unidadEquipoId es la clave foránea hacia UnidadEquipo.
 */
export type MantenimientoDto = {
    id: number;
    unidadEquipoId: number;
    danoId: number | null;
    tipo: string; // PREVENTIVO | CORRECTIVO
    fechaIngreso: string; // OffsetDateTime ISO-8601
    fechaEgresoEstimada: string;
    fechaEgresoReal: string | null;
    estado: string; // EN_PROCESO | COMPLETADO | CANCELADO
    createdAt: string;
};

/** Cuerpo de POST y PUT /api/mantenimientos (Crear/ActualizarMantenimientoRequest). */
export type MantenimientoRequest = {
    unidadEquipoId: number;
    danoId: number | null;
    tipo: string;
    fechaIngreso: string;
    fechaEgresoEstimada: string;
    fechaEgresoReal: string | null;
    estado: string;
};

/** Adaptador HTTP del CRUD de Mantenimiento contra /api/mantenimientos. */
export const mantenimientosApi = {
    /** GET /api/mantenimientos -> 200 (más recientes primero) */
    listar: () => requestHttp<MantenimientoDto[]>('/mantenimientos'),

    /** GET /api/mantenimientos/{id} -> 200 | 404 */
    obtener: (id: number) => requestHttp<MantenimientoDto>(`/mantenimientos/${id}`),

    /** GET /api/mantenimientos/unidad-equipo/{id} -> 200 : relación 1:N */
    porUnidad: (unidadEquipoId: number) =>
        requestHttp<MantenimientoDto[]>(`/mantenimientos/unidad-equipo/${unidadEquipoId}`),

    /** POST /api/mantenimientos -> 201 | 400 validación o fechas | 404 unidad inexistente */
    crear: (cuerpo: MantenimientoRequest) =>
        requestHttp<MantenimientoDto>('/mantenimientos', { method: 'POST', body: JSON.stringify(cuerpo) }),

    /** PUT /api/mantenimientos/{id} -> 200 | 400 | 404 orden o unidad inexistente */
    actualizar: (id: number, cuerpo: MantenimientoRequest) =>
        requestHttp<MantenimientoDto>(`/mantenimientos/${id}`, { method: 'PUT', body: JSON.stringify(cuerpo) }),

    /** DELETE /api/mantenimientos/{id} -> 204 | 404 */
    eliminar: (id: number) => requestHttp<null>(`/mantenimientos/${id}`, { method: 'DELETE' }),
};

// --- Conversión formulario <-> contrato --------------------------------------
// El formulario trabaja con fechas 'AAAA-MM-DD'; el backend exige OffsetDateTime.
// Convención: el ingreso se registra a las 08:00 y los egresos a las 18:00 (-04:00, Bolivia).

/** Formulario ya validado -> cuerpo que exige Spring Boot. */
export function aMantenimientoRequest(datos: MantenimientoRemotoFormulario): MantenimientoRequest {
    const real = datos.fechaEgresoReal.trim();
    return {
        unidadEquipoId: datos.unidadEquipoId ?? 0, // ya validado: nunca llega null
        danoId: null, // el registro de daños no forma parte de esta app
        tipo: datos.tipo,
        fechaIngreso: aOffsetDateTime(datos.fechaIngreso.trim(), '08:00:00'),
        fechaEgresoEstimada: aOffsetDateTime(datos.fechaEgresoEstimada.trim(), '18:00:00'),
        fechaEgresoReal: real === '' ? null : aOffsetDateTime(real, '18:00:00'),
        estado: datos.estado,
    };
}

/** DTO del backend -> valores iniciales del formulario de edición. */
export function aFormularioMantenimiento(dto: MantenimientoDto): MantenimientoRemotoFormulario {
    return {
        unidadEquipoId: dto.unidadEquipoId,
        tipo: dto.tipo,
        fechaIngreso: dto.fechaIngreso.slice(0, 10),
        fechaEgresoEstimada: dto.fechaEgresoEstimada.slice(0, 10),
        fechaEgresoReal: dto.fechaEgresoReal ? dto.fechaEgresoReal.slice(0, 10) : '',
        estado: dto.estado,
    };
}
