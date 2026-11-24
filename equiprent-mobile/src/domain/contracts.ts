import type { Mantenimiento, UnidadEquipo } from '../models/equiprent';

/**
 * CONTRATO (puerto) del repositorio de EquipRent (Guía 07).
 * Dice QUÉ datos se pueden pedir, no CÓMO se obtienen: no depende de fetch,
 * Expo, PostgreSQL ni Android. Puede tener varias implementaciones (adaptadores):
 *  - EquipRentLocalRepository: datos demo en memoria (esta guía).
 *  - un adaptador HTTP contra Spring Boot (Guías 08–10).
 * Las pantallas que dependan del contrato no cambian al cambiar de adaptador.
 */
export interface EquipRentRepository {
    listarUnidades(): Promise<UnidadEquipo[]>;
    buscarUnidad(id: number): Promise<UnidadEquipo | null>;
    /** Sin argumento: todos. Con unidadEquipoId: solo los de esa unidad (relación 1:N). */
    listarMantenimientos(unidadEquipoId?: number): Promise<Mantenimiento[]>;
}
