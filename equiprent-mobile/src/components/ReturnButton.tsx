import React from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '../theme/palette';

// Destinos permitidos cuando no existe una pantalla anterior en la pila.
type Destino = '/' | '/unidades' | '/mantenimientos';
type Props = { destinoSiNoHayHistorial: Destino };

export function ReturnButton({ destinoSiNoHayHistorial }: Props) {
    const router = useRouter();

    function regresar() {
        if (router.canGoBack()) {
            // Hay historial: se saca la pantalla actual de la pila (Stack).
            router.back();
        } else {
            // Sin historial (por ejemplo, entrada por deep link): se reemplaza
            // la pantalla actual sin crear un historial ficticio.
            router.replace(destinoSiNoHayHistorial);
        }
    }

    return (
        <Pressable
            onPress={regresar}
            style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
            accessibilityRole="button"
            accessibilityLabel="Regresar a la pantalla anterior"
        >
            {/* Chevron geométrico dibujado con bordes (sin emojis) */}
            <View style={styles.chevron} />
            <Text style={styles.texto}>Volver</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    boton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        backgroundColor: PALETTE.acento,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginBottom: 14,
    },
    botonPresionado: { opacity: 0.8 },
    chevron: {
        width: 8,
        height: 8,
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: PALETTE.principal,
        transform: [{ rotate: '45deg' }],
        marginLeft: 2,
    },
    texto: { color: PALETTE.principal, fontSize: 14, fontWeight: '800' },
});