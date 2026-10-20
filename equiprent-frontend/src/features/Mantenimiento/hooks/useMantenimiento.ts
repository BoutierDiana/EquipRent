import { useCallback } from 'react';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import type { Mantenimiento } from '../models/Mantenimiento';
import { mantenimientoService } from '../services/mantenimientoService';

/**
 * Carga de órdenes de mantenimiento.
 * - Sin unidadId: GET /api/mantenimientos (todas).
 * - Con unidadId: GET /api/mantenimientos/unidad-equipo/{unidadId}.
 * Cada cambio de unidadId crea un loader nuevo; useAsyncList aborta la petición
 * anterior (AbortController en el cleanup) y evita respuestas obsoletas (Guía 08).
 */
export function useMantenimientos(unidadId?: number) {
    const loader = useCallback(
        (signal: AbortSignal) =>
            unidadId
                ? mantenimientoService.listarPorUnidad(unidadId, signal)
                : mantenimientoService.listar(signal),
        [unidadId],
    );

    return useAsyncList<Mantenimiento>(loader);
}
