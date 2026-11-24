import React from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { MantenimientoNavegable } from '../../components/MantenimientoNavegable';
import { ReturnButton } from '../../components/ReturnButton';
import { mantenimientosDe, puedeEliminarUnidad } from '../../domain/equiprentRules';
import { useEquipRent } from '../../state/EquipRentContext';
import { PALETTE } from '../../theme/palette';
import { formatearCatalogo } from '../../utils/formato';
import { leerIdPositivo } from '../../utils/routeParams';

/** Ruta /unidades/1, /unidades/2 ... : ficha LOCAL de la unidad, editar, eliminar y sus N mantenimientos. */
export default function DetalleUnidadScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { unidades, mantenimientos, dispatch } = useEquipRent();
    const unidad = unidades.find((u) => u.id === leerIdPositivo(id));

    if (!unidad) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/unidades" />
                <EmptyState mensaje="No se encontró la unidad de equipo solicitada o su ID no es válido." />
                <Link href="/unidades" asChild>
                    <Pressable style={styles.accion} accessibilityRole="link">
                        <Text style={styles.accionTexto}>Ir al catálogo de unidades</Text>
                    </Pressable>
                </Link>
            </View>
        );
    }

    // Relación 1:N: los mantenimientos cuyo unidadEquipoId coincide con esta unidad.
    const asociados = mantenimientosDe(unidad.id, mantenimientos);

    function confirmarEliminar() {
        if (!unidad) return;
        if (!puedeEliminarUnidad(unidad.id, mantenimientos)) {
            Alert.alert(
                'No se puede eliminar',
                `${unidad.codigoInventario} tiene ${asociados.length} mantenimiento(s). ` +
                    'Primero elimínalos o reasígnalos (regla 1:N).'
            );
            return;
        }
        Alert.alert('Confirmación', `¿Eliminar la unidad ${unidad.codigoInventario}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => {
                    dispatch({ type: 'UNIDAD_ELIMINAR', id: unidad.id });
                    router.replace('/unidades');
                },
            },
        ]);
    }

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/unidades" />

            <View style={styles.ficha}>
                <Text style={styles.codigo}>{unidad.codigoInventario}</Text>
                <Text style={styles.titulo}>
                    {unidad.marca} {unidad.modelo}
                </Text>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>N.º de Serie:</Text>
                    <Text style={styles.datoValor}>{unidad.numeroSerie}</Text>
                </View>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Estado Operativo:</Text>
                    <Text style={styles.datoLima}>{formatearCatalogo(unidad.estadoOperativo)}</Text>
                </View>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Registro:</Text>
                    <Text style={styles.datoValor}>{unidad.activo ? 'ACTIVA' : 'INACTIVA'}</Text>
                </View>
            </View>

            <Link href={{ pathname: '/unidades/editar/[id]', params: { id: String(unidad.id) } }} asChild>
                <Pressable
                    style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
                    accessibilityRole="link"
                    accessibilityLabel="Editar unidad"
                >
                    <Text style={styles.botonTexto}>Editar unidad</Text>
                </Pressable>
            </Link>
            <Pressable
                onPress={confirmarEliminar}
                style={({ pressed }) => [styles.peligro, pressed && styles.presionado]}
                accessibilityRole="button"
                accessibilityLabel="Eliminar unidad"
            >
                <Text style={styles.peligroTexto}>Eliminar unidad</Text>
            </Pressable>

            <Text style={styles.subtitulo}>Historial de Mantenimientos (1:N) · {asociados.length}</Text>

            <Link
                href={{ pathname: '/mantenimientos/nuevo', params: { unidadId: String(unidad.id) } }}
                asChild
            >
                <Pressable
                    style={({ pressed }) => [styles.secundario, pressed && styles.presionado]}
                    accessibilityRole="link"
                    accessibilityLabel={`Nueva orden para ${unidad.codigoInventario}`}
                >
                    <Text style={styles.secundarioTexto}>+ Nueva orden para esta unidad</Text>
                </Pressable>
            </Link>

            {asociados.length === 0 ? (
                <EmptyState mensaje="Esta unidad no registra órdenes de taller preventivo ni correctivo." />
            ) : (
                asociados.map((m) => (
                    <MantenimientoNavegable
                        key={m.id}
                        mantenimiento={m}
                        codigoUnidad={unidad.codigoInventario}
                    />
                ))
            )}

            <Text style={styles.pie}>Una unidad con mantenimientos no se puede eliminar.</Text>
        </ScrollView>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
const PELIGRO = '#f87171';

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 40 },
    ficha: {
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderLeftWidth: 3,
        borderLeftColor: PALETTE.lima,
        borderRadius: 12,
        padding: 16,
    },
    codigo: { fontFamily: MONO, color: PALETTE.lima, fontWeight: '700' },
    titulo: { marginTop: 6, fontSize: 24, color: PALETTE.principal, fontWeight: '800' },
    filaDato: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: PALETTE.acentoClaro,
    },
    datoEtiqueta: { color: PALETTE.secundario },
    datoValor: { fontFamily: MONO, color: PALETTE.principal, fontWeight: '700' },
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
    secundario: {
        minHeight: 46,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acentoClaro,
        borderWidth: 1,
        borderColor: PALETTE.acento,
        borderRadius: 10,
        marginBottom: 12,
    },
    secundarioTexto: { color: PALETTE.lima, fontWeight: '800', letterSpacing: 1 },
    subtitulo: {
        fontSize: 17,
        fontWeight: '800',
        marginTop: 24,
        marginBottom: 12,
        color: PALETTE.principal,
    },
    pie: { color: PALETTE.secundario, textAlign: 'center', marginTop: 14, fontSize: 12 },
    accion: { marginTop: 16, backgroundColor: PALETTE.acentoClaro, padding: 16, borderRadius: 12 },
    accionTexto: { color: PALETTE.principal, fontWeight: '700', textAlign: 'center' },
});
