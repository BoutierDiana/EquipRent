import { useAsyncList } from '../../../shared/hooks/useAsyncList';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import { unidadEquipoService } from '../services/unidadEquipoService';

export function useUnidadesEquipo() {
    return useAsyncList<UnidadEquipo>(unidadEquipoService.listar);
}