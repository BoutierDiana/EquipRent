import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { EquipRentProvider } from '../state/EquipRentContext';
import { PALETTE } from '../theme/palette';

/**
 * Todas las pantallas comparten una navegación tipo pila (Stack).
 * EquipRentProvider envuelve el Stack para que TODAS lean el mismo estado (Guía 05).
 */
export default function RootLayout() {
    return (
        <EquipRentProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#0e071a' }, // cyberHeader
                    headerTintColor: PALETTE.principal,
                    headerTitleStyle: { fontWeight: 'bold' },
                    headerShadowVisible: false,
                    contentStyle: { backgroundColor: PALETTE.fondo },
                }}
            >
                {/* Cada name coincide EXACTAMENTE con un archivo dentro de src/app */}
                <Stack.Screen name="index" options={{ title: 'Alquiler de equipos' }} />
                <Stack.Screen name="unidades/index" options={{ title: 'Catálogo de Unidades' }} />
                <Stack.Screen name="unidades/nuevo" options={{ title: 'Nueva Unidad' }} />
                <Stack.Screen name="unidades/editar/[id]" options={{ title: 'Editar Unidad' }} />
                <Stack.Screen name="unidades/[id]" options={{ title: 'Ficha de Unidad' }} />
                <Stack.Screen name="remoto/index" options={{ title: 'Datos Persistidos' }} />
                <Stack.Screen name="remoto/unidades/index" options={{ title: 'Unidades (API)' }} />
                <Stack.Screen name="remoto/unidades/nuevo" options={{ title: 'Nueva Unidad (API)' }} />
                <Stack.Screen name="remoto/unidades/editar/[id]" options={{ title: 'Editar Unidad (API)' }} />
                <Stack.Screen name="remoto/unidades/[id]" options={{ title: 'Ficha Remota' }} />
                <Stack.Screen name="remoto/mantenimientos/index" options={{ title: 'Órdenes (API)' }} />
                <Stack.Screen name="remoto/mantenimientos/nuevo" options={{ title: 'Nueva Orden (API)' }} />
                <Stack.Screen name="remoto/mantenimientos/editar/[id]" options={{ title: 'Editar Orden (API)' }} />
                <Stack.Screen name="remoto/mantenimientos/[id]" options={{ title: 'Detalle Orden (API)' }} />
                <Stack.Screen name="mantenimientos/index" options={{ title: 'Órdenes de Taller' }} />
                <Stack.Screen name="mantenimientos/nuevo" options={{ title: 'Nueva Orden de Taller' }} />
                <Stack.Screen name="mantenimientos/editar/[id]" options={{ title: 'Editar Orden' }} />
                <Stack.Screen name="mantenimientos/[id]" options={{ title: 'Detalle de la Orden' }} />
                <Stack.Screen name="diagnostico" options={{ title: 'Diagnóstico API' }} />
                <Stack.Screen name="ayuda" options={{ title: 'Laboratorio y Pruebas' }} />
                <Stack.Screen name="+not-found" options={{ title: 'Ruta desconocida' }} />
            </Stack>
        </EquipRentProvider>
    );
}