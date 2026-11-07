import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PALETTE } from '../theme/palette';

/** Todas las pantallas comparten una navegación tipo pila (Stack). */
export default function RootLayout() {
    return (
        <>
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
                <Stack.Screen name="unidades/[id]" options={{ title: 'Ficha de Unidad' }} />
                <Stack.Screen name="mantenimientos/index" options={{ title: 'Órdenes de Taller' }} />
                <Stack.Screen name="mantenimientos/nuevo" options={{ title: 'Nueva Orden de Taller' }} />
                <Stack.Screen name="mantenimientos/[id]" options={{ title: 'Detalle de la Orden' }} />
                <Stack.Screen name="ayuda" options={{ title: 'Laboratorio y Pruebas' }} />
                <Stack.Screen name="+not-found" options={{ title: 'Ruta desconocida' }} />
            </Stack>
        </>
    );
}