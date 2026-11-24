import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { MantenimientoForm } from '../../components/MantenimientoForm';
import type { MantenimientoFormulario } from '../../domain/validaciones';
import { useEquipRent } from '../../state/EquipRentContext';
import { PALETTE } from '../../theme/palette';

/**
 * Ruta /mantenimientos/nuevo : Nueva Orden de Taller.
 * Guía 05: las unidades del selector salen del estado compartido, así una unidad
 * recién registrada ya se puede elegir. Todavía solo VALIDA: el guardado local
 * (MANTENIMIENTO_CREAR) llega en la Guía 06.
 */
export default function NuevaOrdenScreen() {
    const { unidades } = useEquipRent();

    function alConfirmar(datos: MantenimientoFormulario) {
        const unidad = unidades.find((u) => u.id === datos.unidadEquipoId);
        Alert.alert(
            'Datos válidos',
            `Unidad: ${unidad?.codigoInventario ?? '-'}\n` +
            `Fecha: ${datos.fecha}\n` +
            `Descripción: ${datos.descripcion.trim()}\n` +
            `Costo: $${datos.costo}\n\n` +
            'Aún no se guarda (Guía 06).'
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <MantenimientoForm unidades={unidades} alConfirmar={alConfirmar} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
    contenido: { padding: 18, paddingBottom: 40 },
});