import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../state/AuthContext';
import { OPCIONES_STACK } from '../../theme/navegacion';
import { PALETTE } from '../../theme/palette';

/**
 * Guardia de /remoto (Guía 11): sin token, cualquier pantalla de datos
 * persistidos redirige a /login. OJO: esto es solo comodidad de la interfaz;
 * la protección REAL la hace el backend devolviendo 401 en cada endpoint.
 */
export default function RemotoLayout() {
    const { cargando, token } = useAuth();

    if (cargando) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', backgroundColor: PALETTE.fondo }}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
            </View>
        );
    }

    if (!token) {
        return <Redirect href="/login" />;
    }

    return (
        <Stack screenOptions={OPCIONES_STACK}>
            <Stack.Screen name="index" options={{ title: 'Datos Persistidos' }} />
            <Stack.Screen name="unidades/index" options={{ title: 'Unidades (API)' }} />
            <Stack.Screen name="unidades/nuevo" options={{ title: 'Nueva Unidad (API)' }} />
            <Stack.Screen name="unidades/editar/[id]" options={{ title: 'Editar Unidad (API)' }} />
            <Stack.Screen name="unidades/[id]" options={{ title: 'Ficha Remota' }} />
            <Stack.Screen name="mantenimientos/index" options={{ title: 'Órdenes (API)' }} />
            <Stack.Screen name="mantenimientos/nuevo" options={{ title: 'Nueva Orden (API)' }} />
            <Stack.Screen name="mantenimientos/editar/[id]" options={{ title: 'Editar Orden (API)' }} />
            <Stack.Screen name="mantenimientos/[id]" options={{ title: 'Detalle Orden (API)' }} />
            <Stack.Screen name="offline/index" options={{ title: 'Modo sin conexión' }} />
            <Stack.Screen name="offline/[id]" options={{ title: 'Editar sin conexión' }} />
        </Stack>
    );
}
