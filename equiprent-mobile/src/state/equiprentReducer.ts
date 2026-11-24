import { MANTENIMIENTOS, UNIDADES } from '../data/demoData';
import type { Mantenimiento, UnidadEquipo } from '../models/equiprent';

/**
 * Estado compartido de EquipRent Mobile (Guía 05).
 * Vive SOLO en memoria: al recargar la app vuelven las 4 unidades y los
 * 5 mantenimientos de demoData. Nada de esto toca PostgreSQL.
 */
export type EquipRentState = {
    unidades: UnidadEquipo[];
    mantenimientos: Mantenimiento[];
};

/** Unión discriminada: cada acción describe UN cambio posible del estado. */
export type EquipRentAction =
    | { type: 'UNIDAD_CREAR'; payload: UnidadEquipo }
    | { type: 'UNIDAD_EDITAR'; payload: UnidadEquipo }
    | { type: 'UNIDAD_ELIMINAR'; id: number }
    | { type: 'MANTENIMIENTO_CREAR'; payload: Mantenimiento }
    | { type: 'MANTENIMIENTO_EDITAR'; payload: Mantenimiento }
    | { type: 'MANTENIMIENTO_ELIMINAR'; id: number };

export const estadoInicial: EquipRentState = {
    unidades: [...UNIDADES],
    mantenimientos: [...MANTENIMIENTOS],
};

/** true si otra unidad (distinta de idActual) ya usa ese código o esa serie. */
function unidadDuplicada(unidades: readonly UnidadEquipo[], u: UnidadEquipo): boolean {
    return unidades.some(
        (otra) =>
            otra.id !== u.id &&
            (otra.codigoInventario === u.codigoInventario || otra.numeroSerie === u.numeroSerie)
    );
}

/**
 * Reducer PURO: recibe el estado anterior y una acción, y devuelve un estado NUEVO.
 * Nunca se modifica el arreglo original (React detecta cambios por referencia).
 * Si la acción rompe una regla, se devuelve el mismo estado (no cambia nada).
 */
export function equiprentReducer(state: EquipRentState, action: EquipRentAction): EquipRentState {
    switch (action.type) {
        case 'UNIDAD_CREAR':
            if (state.unidades.some((u) => u.id === action.payload.id)) return state;
            if (unidadDuplicada(state.unidades, action.payload)) return state;
            return { ...state, unidades: [...state.unidades, action.payload] };

        case 'UNIDAD_EDITAR':
            if (unidadDuplicada(state.unidades, action.payload)) return state;
            return {
                ...state,
                unidades: state.unidades.map((u) => (u.id === action.payload.id ? action.payload : u)),
            };

        case 'UNIDAD_ELIMINAR':
            // Regla 1:N: una unidad con mantenimientos registrados no se puede borrar.
            if (state.mantenimientos.some((m) => m.unidadEquipoId === action.id)) return state;
            return { ...state, unidades: state.unidades.filter((u) => u.id !== action.id) };

        case 'MANTENIMIENTO_CREAR':
            // Regla 1:N: la clave foránea debe apuntar a una unidad existente.
            if (!state.unidades.some((u) => u.id === action.payload.unidadEquipoId)) return state;
            if (state.mantenimientos.some((m) => m.id === action.payload.id)) return state;
            return { ...state, mantenimientos: [...state.mantenimientos, action.payload] };

        case 'MANTENIMIENTO_EDITAR':
            if (!state.unidades.some((u) => u.id === action.payload.unidadEquipoId)) return state;
            return {
                ...state,
                mantenimientos: state.mantenimientos.map((m) =>
                    m.id === action.payload.id ? action.payload : m
                ),
            };

        case 'MANTENIMIENTO_ELIMINAR':
            return {
                ...state,
                mantenimientos: state.mantenimientos.filter((m) => m.id !== action.id),
            };
    }
}

/** Siguiente id libre: el mayor id existente + 1 (1 si la lista está vacía). */
export const siguienteId = (registros: readonly { id: number }[]): number =>
    Math.max(0, ...registros.map((r) => r.id)) + 1;
