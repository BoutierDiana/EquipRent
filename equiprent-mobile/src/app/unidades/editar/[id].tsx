import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { ReturnButton } from '../../../components/ReturnButton';
import { UnidadForm } from '../../../components/UnidadForm';
import { useEquipRent } from '../../../state/EquipRentContext';
import { PALETTE } from '../../../theme/palette';
import { leerIdPositivo } from '../../../utils/routeParams';

/** Ruta /unidades/editar/1 ... : edición LOCAL de una unidad (dispatch UNIDAD_EDITAR). */
export default function EditarUnidadScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { unidades, dispatch } = useEquipRent();
    const unidad = unidades.find((u) => u.id === leerIdPositivo(id));

    if (!unidad) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/unidades" />
                <EmptyState mensaje="No se encontró la unidad a editar o su ID no es válido." />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <UnidadForm
                    existentes={unidades}
                    idActual={unidad.id}
                    valorInicial={{
                        codigoInventario: unidad.codigoInventario,
                        numeroSerie: unidad.numeroSerie,
                        marca: unidad.marca,
                        modelo: unidad.modelo,
                        estadoOperativo: unidad.estadoOperativo,
                        activo: unidad.activo,
                    }}
                    textoBoton="Guardar cambios LOCALES"
                    alGuardar={(datos) => {
                        dispatch({ type: 'UNIDAD_EDITAR', payload: { id: unidad.id, ...datos } });
                        router.replace({ pathname: '/unidades/[id]', params: { id: String(unidad.id) } });
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
