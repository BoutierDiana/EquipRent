import React from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { MantenimientoForm } from '../../components/MantenimientoForm';
import { UNIDADES } from '../../data/demoData';
import type { MantenimientoFormulario } from '../../domain/validaciones';
import { PALETTE } from '../../theme/palette';

/**
 * Ruta /mantenimientos/nuevo : Nueva Orden de Taller.
 * Guía 04: solo VALIDA. No llama a ningún servicio ni modifica MANTENIMIENTOS,
 * por eso la lista de órdenes sigue mostrando los 5 registros (validar no es persistir).
 * El guardado real (POST /api/mantenimientos) llega en una guía posterior.
 */
export default function NuevaOrdenScreen() {
    function alConfirmar(datos: MantenimientoFormulario) {
        const unidad = UNIDADES.find((u) => u.id === datos.unidadEquipoId);
        Alert.alert(
            'Datos válidos',
            `Unidad: ${unidad?.codigoInventario ?? '-'}\n` +
            `Fecha: ${datos.fecha}\n` +
            `Descripción: ${datos.descripcion.trim()}\n` +
            `Costo: $${datos.costo}\n\n` +
            'Todavía no se envía a Spring Boot.'
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <MantenimientoForm unidades={UNIDADES} alConfirmar={alConfirmar} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
    contenido: { padding: 18, paddingBottom: 40 },
});