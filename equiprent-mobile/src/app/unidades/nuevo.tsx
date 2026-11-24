import React from 'react';
import { useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { UnidadForm } from '../../components/UnidadForm';
import { useEquipRent } from '../../state/EquipRentContext';
import { siguienteId } from '../../state/equiprentReducer';
import { PALETTE } from '../../theme/palette';

/** Ruta /unidades/nuevo : alta LOCAL de una unidad (dispatch UNIDAD_CREAR). */
export default function NuevaUnidadScreen() {
    const router = useRouter();
    const { unidades, dispatch } = useEquipRent();

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <UnidadForm
                    existentes={unidades}
                    textoBoton="Registrar unidad LOCAL"
                    alGuardar={(datos) => {
                        dispatch({ type: 'UNIDAD_CREAR', payload: { id: siguienteId(unidades), ...datos } });
                        // replace: el formulario no queda en el historial al pulsar Volver.
                        router.replace('/unidades');
                    }}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
    contenido: { padding: 18, paddingBottom: 40 },
});
