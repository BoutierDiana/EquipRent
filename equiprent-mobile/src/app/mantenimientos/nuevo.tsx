import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { MantenimientoForm } from '../../components/MantenimientoForm';
import { FORMULARIO_VACIO, leerCosto } from '../../domain/validaciones';
import { useEquipRent } from '../../state/EquipRentContext';
import { siguienteId } from '../../state/equiprentReducer';
import { PALETTE } from '../../theme/palette';
import { leerIdPositivo } from '../../utils/routeParams';

/**
 * Ruta /mantenimientos/nuevo : alta LOCAL de una orden de taller (Guía 06).
 * Opcional: /mantenimientos/nuevo?unidadId=2 preselecciona la unidad (lado 1).
 * Guarda con dispatch MANTENIMIENTO_CREAR; el reducer rechaza una unidad inexistente.
 */
export default function NuevaOrdenScreen() {
    const router = useRouter();
    const { unidadId } = useLocalSearchParams<{ unidadId?: string }>();
    const { unidades, mantenimientos, dispatch } = useEquipRent();

    // Solo se preselecciona si el id de la ruta corresponde a una unidad existente.
    const preseleccion = leerIdPositivo(unidadId);
    const unidadInicial = unidades.some((u) => u.id === preseleccion) ? preseleccion : null;

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <MantenimientoForm
                    unidades={unidades}
                    valorInicial={{ ...FORMULARIO_VACIO, unidadEquipoId: unidadInicial }}
                    textoBoton="Guardar orden LOCAL"
                    alConfirmar={(datos) => {
                        if (datos.unidadEquipoId === null) return; // ya validado en el formulario
                        dispatch({
                            type: 'MANTENIMIENTO_CREAR',
                            payload: {
                                id: siguienteId(mantenimientos),
                                unidadEquipoId: datos.unidadEquipoId,
                                tipoMantenimiento: datos.tipoMantenimiento,
                                fecha: datos.fecha,
                                descripcion: datos.descripcion,
                                costo: leerCosto(datos.costo),
                                activo: true,
                            },
                        });
                        // replace: el formulario no queda en el historial.
                        router.replace('/mantenimientos');
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
