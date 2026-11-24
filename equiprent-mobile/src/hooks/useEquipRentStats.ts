import { useMemo } from 'react';
import { costoTotalActivo, puedeEliminarUnidad } from '../domain/equiprentRules';
import { useEquipRent } from '../state/EquipRentContext';

/**
 * Hook de PRESENTACIÓN (Guía 07): calcula el resumen del Inicio.
 * No cambia el estado ni consulta la red; useMemo recalcula solo cuando
 * cambian las listas de unidades o mantenimientos.
 */
export function useEquipRentStats() {
    const { unidades, mantenimientos } = useEquipRent();

    return useMemo(
        () => ({
            unidades: unidades.length,
            mantenimientos: mantenimientos.length,
            unidadesActivas: unidades.filter((u) => u.activo).length,
            // Unidades sin ninguna orden (las únicas que se pueden eliminar).
            sinMantenimientos: unidades.filter((u) => puedeEliminarUnidad(u.id, mantenimientos)).length,
            costoTotal: costoTotalActivo(mantenimientos),
        }),
        [unidades, mantenimientos]
    );
}
