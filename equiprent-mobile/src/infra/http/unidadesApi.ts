import { leerCosto, normalizarCodigo, type UnidadRemotaFormulario } from '../../domain/validaciones';
import { requestHttp } from './apiClient';

/**
 * DTO REMOTO (Guía 09): forma EXACTA del JSON de Spring Boot (record UnidadEquipoResponse).
 * Las pantallas /remoto usan este tipo directamente: muestran lo que REALMENTE
 * está en PostgreSQL, sin inventar campos que el backend no guarda.
 */
export type UnidadEquipoDto = {
    id: number;
    equipoId: number;
    numeroSerie: string;
    estadoOperativo: string;
    metricaUsoAcumulada: number;
    notasEstado: string | null;
    activo: boolean;
    createdAt: string;
};

/** Cuerpo de POST /api/unidades-equipo (record CrearUnidadEquipoRequest). */
export type CrearUnidadRequest = {
    equipoId: number;
    numeroSerie: string;
    estadoOperativo: string;
    metricaUsoAcumulada: number;
    notasEstado: string | null;
};

/** Cuerpo de PUT /api/unidades-equipo/{id}: igual que crear + activo. */
export type ActualizarUnidadRequest = CrearUnidadRequest & { activo: boolean };

/** Adaptador HTTP del CRUD de UnidadEquipo contra /api/unidades-equipo. */
export const unidadesApi = {
    /** GET /api/unidades-equipo -> 200 */
    listar: () => requestHttp<UnidadEquipoDto[]>('/unidades-equipo'),

    /** GET /api/unidades-equipo/{id} -> 200 | 404 */
    obtener: (id: number) => requestHttp<UnidadEquipoDto>(`/unidades-equipo/${id}`),

    /** POST /api/unidades-equipo -> 201 | 400 validación | 409 número de serie duplicado */
    crear: (cuerpo: CrearUnidadRequest) =>
        requestHttp<UnidadEquipoDto>('/unidades-equipo', {
            method: 'POST',
            body: JSON.stringify(cuerpo),
        }),

    /** PUT /api/unidades-equipo/{id} -> 200 | 400 | 404 | 409 */
    actualizar: (id: number, cuerpo: ActualizarUnidadRequest) =>
        requestHttp<UnidadEquipoDto>(`/unidades-equipo/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cuerpo),
        }),

    /** DELETE /api/unidades-equipo/{id} -> 204 | 404 | 409 si tiene mantenimientos */
    eliminar: (id: number) =>
        requestHttp<null>(`/unidades-equipo/${id}`, { method: 'DELETE' }),
};

// --- Conversión formulario <-> contrato (mapper de la capa HTTP) ---------------


/** Formulario ya validado -> cuerpo que exige Spring Boot. */
export function aActualizarRequest(datos: UnidadRemotaFormulario): ActualizarUnidadRequest {
    const notas = datos.notasEstado.trim();
    return {
        equipoId: datos.equipoId ?? 0, // ya validado: nunca llega null
        numeroSerie: normalizarCodigo(datos.numeroSerie),
        estadoOperativo: datos.estadoOperativo,
        metricaUsoAcumulada: leerCosto(datos.metricaUsoAcumulada),
        notasEstado: notas === '' ? null : notas,
        activo: datos.activo,
    };
}

/** DTO del backend -> valores iniciales del formulario de edición. */
export function aFormulario(dto: UnidadEquipoDto): UnidadRemotaFormulario {
    return {
        equipoId: dto.equipoId,
        numeroSerie: dto.numeroSerie,
        estadoOperativo: dto.estadoOperativo,
        metricaUsoAcumulada: String(dto.metricaUsoAcumulada),
        notasEstado: dto.notasEstado ?? '',
        activo: dto.activo,
    };
}
