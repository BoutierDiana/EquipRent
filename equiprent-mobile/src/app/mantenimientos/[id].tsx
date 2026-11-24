import React from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ReturnButton } from '../../components/ReturnButton';
import { useEquipRent } from '../../state/EquipRentContext';
import { PALETTE } from '../../theme/palette';
import { leerIdPositivo } from '../../utils/routeParams';

/** Ruta /mantenimientos/1, /mantenimientos/2 ... : detalle de una orden (lado N), editar y eliminar. */
export default function DetalleMantenimientoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { unidades, mantenimientos, dispatch } = useEquipRent();
    const mantenimientoId = leerIdPositivo(id); // 'abc' -> null
    const mantenimiento = mantenimientos.find((m) => m.id === mantenimientoId);

    if (!mantenimiento) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/mantenimientos" />
                <EmptyState mensaje="No se encontró la orden de mantenimiento solicitada o su ID no es válido." />
                <Link href="/mantenimientos" asChild>
                    <Pressable style={styles.accion} accessibilityRole="link">
                        <Text style={styles.accionTexto}>Ir a las órdenes de taller</Text>
                    </Pressable>
                </Link>
            </View>
        );
    }

    // Lado 1 de la relación: la unidad dueña de esta orden.
    const unidad = unidades.find((u) => u.id === mantenimiento.unidadEquipoId);

    function confirmarEliminar() {
        if (!mantenimiento) return;
        Alert.alert('Eliminar orden', `¿Eliminar la orden N.º ${mantenimiento.id}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => {
                    dispatch({ type: 'MANTENIMIENTO_ELIMINAR', id: mantenimiento.id });
                    router.replace('/mantenimientos');
                },
            },
        ]);
    }

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/mantenimientos" />
            <Text style={styles.etiqueta}>ORDEN N.º {mantenimiento.id}</Text>
            <Text style={styles.titulo}>{mantenimiento.descripcion}</Text>

            <View style={styles.ficha}>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Tipo:</Text>
                    <Text style={styles.datoAcento}>{mantenimiento.tipoMantenimiento}</Text>
                </View>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Fecha:</Text>
                    <Text style={styles.datoMono}>{mantenimiento.fecha}</Text>
                </View>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Costo:</Text>
                    <Text style={styles.datoLima}>${mantenimiento.costo.toFixed(2)}</Text>
                </View>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Registro:</Text>
                    <Text style={styles.datoMono}>{mantenimiento.activo ? 'ACTIVO' : 'INACTIVO'}</Text>
                </View>
            </View>

            <Link
                href={{ pathname: '/mantenimientos/editar/[id]', params: { id: String(mantenimiento.id) } }}
                asChild
            >
                <Pressable
                    style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
                    accessibilityRole="link"
                    accessibilityLabel="Editar orden"
                >
                    <Text style={styles.botonTexto}>Editar orden</Text>
                </Pressable>
            </Link>
            <Pressable
                onPress={confirmarEliminar}
                style={({ pressed }) => [styles.peligro, pressed && styles.presionado]}
                accessibilityRole="button"
                accessibilityLabel="Eliminar orden"
            >
                <Text style={styles.peligroTexto}>Eliminar orden</Text>
            </Pressable>

            <Text style={styles.subtitulo}>Unidad de equipo asociada</Text>
            <Text style={styles.dato}>
                {unidad ? `${unidad.codigoInventario} · ${unidad.marca} ${unidad.modelo}` : 'Unidad no encontrada'}
            </Text>

            {unidad ? (
                <Link
                    href={{ pathname: '/unidades/[id]', params: { id: String(unidad.id) } }}
                    asChild
                >
                    <Pressable style={styles.accion} accessibilityRole="link">
                        <Text style={styles.accionTexto}>Ver ficha de la unidad</Text>
                    </Pressable>
                </Link>
            ) : (
                <EmptyState mensaje="Esta orden no tiene una unidad válida en los datos locales." />
            )}

            <Text style={styles.pie}>Guía 06: cambios en memoria, se pierden al recargar la app.</Text>
        </ScrollView>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
const PELIGRO = '#f87171';

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 40 },
    etiqueta: { color: PALETTE.acento, fontWeight: '800', letterSpacing: 1 },
    titulo: { marginTop: 6, fontSize: 22, color: PALETTE.principal, fontWeight: '800' },
    ficha: {
        marginTop: 16,
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    filaDato: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
    },
    datoEtiqueta: { color: PALETTE.secundario },
    datoAcento: { color: PALETTE.acento, fontWeight: '800' },
    datoMono: { fontFamily: MONO, color: PALETTE.principal },
    datoLima: { color: PALETTE.lima, fontWeight: '800' },
    boton: {
        marginTop: 16,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    botonTexto: { color: PALETTE.principal, fontWeight: '800', letterSpacing: 1 },
    peligro: {
        marginTop: 10,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: PELIGRO,
        borderRadius: 10,
    },
    peligroTexto: { color: PELIGRO, fontWeight: '800', letterSpacing: 1 },
    presionado: { opacity: 0.85 },
    subtitulo: { fontSize: 17, fontWeight: '800', marginTop: 24, color: PALETTE.principal },
    dato: { marginTop: 8, color: PALETTE.secundario, lineHeight: 22 },
    accion: { marginTop: 16, backgroundColor: PALETTE.acentoClaro, padding: 16, borderRadius: 12 },
    accionTexto: { color: PALETTE.principal, fontWeight: '700', textAlign: 'center' },
    pie: { marginTop: 22, textAlign: 'center', color: PALETTE.secundario, fontSize: 12 },
});