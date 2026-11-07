import type { UnidadEquipo } from '../models/equiprent';
import { requestHttp } from './apiClient';

/**
 * Forma EXACTA del JSON que devuelve Spring Boot (record UnidadEquipoResponse).
 * Es el contrato de transporte; no se usa directamente en las pantallas.
 */
type UnidadEquipoResponse = {
    id: number;
    equipoId: number;
    numeroSerie: string;
    estadoOperativo: string;
    metricaUsoAcumulada: number;
    notasEstado: string | null;
    activo: boolean;
    createdAt: string;
};

/**
 * Adaptador: convierte la respuesta del backend al modelo UnidadEquipo de la app
 * (src/models/equiprent.ts), sin cambiar ese modelo.
 * El backend no envía codigoInventario, marca ni modelo (viven en el catálogo
 * de Equipo); se derivan del id y del equipoId para que las tarjetas no salgan vacías.
 */
function aUnidadEquipo(dto: UnidadEquipoResponse): UnidadEquipo {
    return {
        id: dto.id,
        codigoInventario: `EQ-${String(dto.id).padStart(3, '0')}`,
        numeroSerie: dto.numeroSerie,
        marca: 'Equipo',
        modelo: `#${dto.equipoId}`,
        estadoOperativo: dto.estadoOperativo,
        activo: dto.activo,
    };
}

export const unidadesService = {
    /** GET /api/unidades-equipo */
    async obtenerTodas(): Promise<UnidadEquipo[]> {
        const datos = await requestHttp<UnidadEquipoResponse[]>('/unidades-equipo');
        return datos.map(aUnidadEquipo);
    },

    /** GET /api/unidades-equipo/{id} (404 si no existe) */
    async obtenerPorId(id: number): Promise<UnidadEquipo> {
        const dato = await requestHttp<UnidadEquipoResponse>(`/unidades-equipo/${id}`);
        return aUnidadEquipo(dato);
    },
};