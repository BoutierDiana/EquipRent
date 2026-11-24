import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { MantenimientoForm } from '../../../components/MantenimientoForm';
import { ReturnButton } from '../../../components/ReturnButton';
import { leerCosto } from '../../../domain/validaciones';
import { useEquipRent } from '../../../state/EquipRentContext';
import { PALETTE } from '../../../theme/palette';
import { leerIdPositivo } from '../../../utils/routeParams';

/**
 * Ruta /mantenimientos/editar/1 ... : edición LOCAL de una orden (dispatch MANTENIMIENTO_EDITAR).
 * Se puede cambiar la unidad: así se REASIGNA la orden a otra unidad (relación 1:N).
 */
export default function EditarOrdenScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { unidades, mantenimientos, dispatch } = useEquipRent();
    const mantenimiento = mantenimientos.find((m) => m.id === leerIdPositivo(id));

    if (!mantenimiento) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/mantenimientos" />
                <EmptyState mensaje="No se encontró la orden a editar o su ID no es válido." />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <MantenimientoForm
                    unidades={unidades}
                    valorInicial={{
                        unidadEquipoId: mantenimiento.unidadEquipoId,
                        tipoMantenimiento: mantenimiento.tipoMantenimiento,
                        fecha: mantenimiento.fecha,
                        descripcion: mantenimiento.descripcion,
                        costo: String(mantenimiento.costo), // el formulario trabaja con texto
                    }}
                    textoBoton="Guardar cambios LOCALES"
                    alConfirmar={(datos) => {
                        if (datos.unidadEquipoId === null) return;
                        dispatch({
                            type: 'MANTENIMIENTO_EDITAR',
                            payload: {
                                ...mantenimiento, // conserva id y activo
                                unidadEquipoId: datos.unidadEquipoId,
                                tipoMantenimiento: datos.tipoMantenimiento,
                                fecha: datos.fecha,
                                descripcion: datos.descripcion,
                                costo: leerCosto(datos.costo),
                            },
                        });
                        router.replace({
                            pathname: '/mantenimientos/[id]',
                            params: { id: String(mantenimiento.id) },
                        });
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
