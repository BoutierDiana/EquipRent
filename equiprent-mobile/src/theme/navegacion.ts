import { PALETTE } from './palette';

/** Estilo de cabecera compartido por el Stack raíz y el Stack protegido de /remoto. */
export const OPCIONES_STACK = {
    headerStyle: { backgroundColor: '#0e071a' }, // cyberHeader
    headerTintColor: PALETTE.principal,
    headerTitleStyle: { fontWeight: 'bold' as const },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: PALETTE.fondo },
};
