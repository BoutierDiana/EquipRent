import type { Mantenimiento } from '../models/equiprent';
import { requestHttp } from './apiClient';

/**
 * Forma EXACTA del JSON que devuelve Spring Boot (record MantenimientoResponse).
 * Es el contrato de transporte; las pantallas usan el modelo Mantenimiento.
 */
type MantenimientoResponse = {
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

/** Cuerpo que exige POST /api/mantenimientos (record CrearMantenimientoRequest). */
export type CrearMantenimientoRequest = {
    unidadEquipoId: number;
    danoId: number | null;
    tipo: 'PREVENTIVO' | 'CORRECTIVO';
    fechaIngreso: string;
    fechaEgresoEstimada: string;
    fechaEgresoReal: string | null;
    estado: 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
};

/**
 * Adaptador: convierte la respuesta del backend al modelo Mantenimiento de la app
 * (src/models/equiprent.ts), sin cambiar ese modelo.
 * El backend no guarda descripcion ni costo; se derivan del tipo y del estado.
 */
function aMantenimiento(dto: MantenimientoResponse): Mantenimiento {
    return {
        id: dto.id,
        unidadEquipoId: dto.unidadEquipoId,
        fecha: dto.fechaIngreso.slice(0, 10), // '2026-03-10T08:00:00Z' -> '2026-03-10'
        descripcion: `Orden ${dto.tipo} · ${dto.estado}`,
        costo: 0,
        tipoMantenimiento: dto.tipo,
        activo: dto.estado !== 'CANCELADO',
    };
}

/** Convierte 'AAAA-MM-DD' (formato del formulario) a OffsetDateTime ISO-8601. */
export function aFechaHoraIso(fecha: string): string {
    return `${fecha}T08:00:00Z`;
}

export const mantenimientosService = {
    /** GET /api/mantenimientos */
    async obtenerTodos(): Promise<Mantenimiento[]> {
        const datos = await requestHttp<MantenimientoResponse[]>('/mantenimientos');
        return datos.map(aMantenimiento);
    },

    /** GET /api/mantenimientos/{id} (404 si no existe) */
    async obtenerPorId(id: number): Promise<Mantenimiento> {
        const dato = await requestHttp<MantenimientoResponse>(`/mantenimientos/${id}`);
        return aMantenimiento(dato);
    },

    /** GET /api/mantenimientos/unidad-equipo/{unidadEquipoId} : relación 1:N */
    async obtenerPorUnidad(unidadEquipoId: number): Promise<Mantenimiento[]> {
        const datos = await requestHttp<MantenimientoResponse[]>(
            `/mantenimientos/unidad-equipo/${unidadEquipoId}`
        );
        return datos.map(aMantenimiento);
    },

    /** POST /api/mantenimientos (201 Created; 400 si falla @Valid en Spring Boot) */
    async crear(solicitud: CrearMantenimientoRequest): Promise<Mantenimiento> {
        const creado = await requestHttp<MantenimientoResponse>('/mantenimientos', {
            method: 'POST',
            body: JSON.stringify(solicitud),
        });
        return aMantenimiento(creado);
    },
};