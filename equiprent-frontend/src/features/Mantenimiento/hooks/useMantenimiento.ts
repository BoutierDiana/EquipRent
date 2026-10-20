import { useCallback } from 'react';
import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import type { Mantenimiento } from '../models/Mantenimiento';
import { mantenimientoService } from '../services/mantenimientoService';

export function useMantenimientos(unidadId?: number) {
    const loader = useCallback(
        (signal: AbortSignal) => {
            if (unidadId) {
                return mantenimientoService.listarPorUnidad(unidadId, signal);
            }
            return Promise.resolve([]);
        },
        [unidadId],
    );

    return useAsyncList<Mantenimiento>(loader);
}