import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../state/AuthContext';
import { EquipRentProvider } from '../state/EquipRentContext';
import { OPCIONES_STACK } from '../theme/navegacion';

/**
 * Todas las pantallas comparten una navegación tipo pila (Stack).
 * - AuthProvider (Guía 11): sesión JWT disponible en toda la app.
 * - EquipRentProvider (Guía 05): estado local compartido.
 * Las pantallas de /remoto tienen su propio Stack protegido en src/app/remoto/_layout.tsx.
 */
export default function RootLayout() {
    return (
        <AuthProvider>
            <EquipRentProvider>
                <StatusBar style="light" />
                <Stack screenOptions={OPCIONES_STACK}>
                    {/* Cada name coincide EXACTAMENTE con un archivo o carpeta dentro de src/app */}
                    <Stack.Screen name="index" options={{ title: 'Alquiler de equipos' }} />
                    <Stack.Screen name="unidades/index" options={{ title: 'Catálogo de Unidades' }} />
                    <Stack.Screen name="unidades/nuevo" options={{ title: 'Nueva Unidad' }} />
                    <Stack.Screen name="unidades/editar/[id]" options={{ title: 'Editar Unidad' }} />
                    <Stack.Screen name="unidades/[id]" options={{ title: 'Ficha de Unidad' }} />
                    <Stack.Screen name="mantenimientos/index" options={{ title: 'Órdenes de Taller' }} />
                    <Stack.Screen name="mantenimientos/nuevo" options={{ title: 'Nueva Orden de Taller' }} />
                    <Stack.Screen name="mantenimientos/editar/[id]" options={{ title: 'Editar Orden' }} />
                    <Stack.Screen name="mantenimientos/[id]" options={{ title: 'Detalle de la Orden' }} />
                    {/* Grupo protegido: su cabecera la dibuja el Stack de remoto/_layout.tsx */}
                    <Stack.Screen name="remoto" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
                    <Stack.Screen name="diagnostico" options={{ title: 'Diagnóstico API' }} />
                    <Stack.Screen name="ayuda" options={{ title: 'Laboratorio y Pruebas' }} />
                    <Stack.Screen name="+not-found" options={{ title: 'Ruta desconocida' }} />
                </Stack>
            </EquipRentProvider>
        </AuthProvider>
    );
}
