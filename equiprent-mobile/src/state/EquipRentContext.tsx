import React, { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import {
    equiprentReducer,
    estadoInicial,
    type EquipRentAction,
    type EquipRentState,
} from './equiprentReducer';

type EquipRentContextValue = EquipRentState & { dispatch: Dispatch<EquipRentAction> };

const EquipRentContext = createContext<EquipRentContextValue | null>(null);

/**
 * Proveedor del estado compartido. Se coloca UNA vez en src/app/_layout.tsx
 * para que todas las pantallas lean y modifiquen las mismas listas.
 */
export function EquipRentProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(equiprentReducer, estadoInicial);
    return (
        <EquipRentContext.Provider value={{ ...state, dispatch }}>{children}</EquipRentContext.Provider>
    );
}

/** Hook para leer el estado: const { unidades, mantenimientos, dispatch } = useEquipRent(); */
export function useEquipRent(): EquipRentContextValue {
    const contexto = useContext(EquipRentContext);
    if (!contexto) {
        throw new Error('useEquipRent requiere EquipRentProvider en src/app/_layout.tsx');
    }
    return contexto;
}
