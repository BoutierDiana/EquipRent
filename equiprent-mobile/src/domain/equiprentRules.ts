import type { Mantenimiento, UnidadEquipo } from '../models/equiprent';

/**
 * DOMINIO (Guía 07): reglas de negocio de EquipRent.
 * Son funciones puras: no dependen de React, de pantallas, de fetch ni de Android.
 * Las usan el reducer y las pantallas, y en la Guía 14 se prueban con Vitest.
 */

/** Relación 1:N: los mantenimientos que pertenecen a una unidad. */
export function mantenimientosDe(
    unidadEquipoId: number,
    mantenimientos: readonly Mantenimiento[]
): Mantenimiento[] {
    return mantenimientos.filter((m) => m.unidadEquipoId === unidadEquipoId);
}

/** Regla 1:N: una unidad solo se puede eliminar si no tiene mantenimientos. */
export function puedeEliminarUnidad(
    unidadEquipoId: number,
    mantenimientos: readonly Mantenimiento[]
): boolean {
    return !mantenimientos.some((m) => m.unidadEquipoId === unidadEquipoId);
}

/** Integridad referencial: la clave foránea unidadEquipoId debe apuntar a una unidad existente. */
export function unidadExiste(id: number, unidades: readonly Pick<UnidadEquipo, 'id'>[]): boolean {
    return unidades.some((u) => u.id === id);
}

/** true si OTRA unidad (distinta de exceptoId) ya usa ese código de inventario. */
export function codigoOcupado(
    codigo: string,
    unidades: readonly Pick<UnidadEquipo, 'id' | 'codigoInventario'>[],
    exceptoId?: number
): boolean {
    return unidades.some((u) => u.codigoInventario === codigo && u.id !== exceptoId);
}

/** true si OTRA unidad (distinta de exceptoId) ya usa ese número de serie. */
export function serieOcupada(
    serie: string,
    unidades: readonly Pick<UnidadEquipo, 'id' | 'numeroSerie'>[],
    exceptoId?: number
): boolean {
    return unidades.some((u) => u.numeroSerie === serie && u.id !== exceptoId);
}

/** Suma del costo de las órdenes activas (las inactivas no cuentan). */
export function costoTotalActivo(mantenimientos: readonly Mantenimiento[]): number {
    return mantenimientos.filter((m) => m.activo).reduce((total, m) => total + m.costo, 0);
}
