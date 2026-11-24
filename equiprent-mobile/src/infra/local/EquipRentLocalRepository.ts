import { MANTENIMIENTOS, UNIDADES } from '../../data/demoData';
import type { EquipRentRepository } from '../../domain/contracts';
import { mantenimientosDe } from '../../domain/equiprentRules';
import type { Mantenimiento, UnidadEquipo } from '../../models/equiprent';

/**
 * ADAPTADOR local del contrato EquipRentRepository (Guía 07).
 * Lee los datos demo; devuelve Promesas para tener la MISMA forma que
 * tendrá el adaptador HTTP (que sí espera a la red).
 * Nota: el estado editable de las Guías 05–06 sigue en el reducer; este
 * repositorio es un ejemplo de la separación dominio / infraestructura.
 */
export class EquipRentLocalRepository implements EquipRentRepository {
    async listarUnidades(): Promise<UnidadEquipo[]> {
        return [...UNIDADES];
    }

    async buscarUnidad(id: number): Promise<UnidadEquipo | null> {
        return UNIDADES.find((u) => u.id === id) ?? null;
    }

    async listarMantenimientos(unidadEquipoId?: number): Promise<Mantenimiento[]> {
        return unidadEquipoId === undefined
            ? [...MANTENIMIENTOS]
            : mantenimientosDe(unidadEquipoId, MANTENIMIENTOS);
    }
}
