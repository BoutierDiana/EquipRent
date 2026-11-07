import React from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ReturnButton } from '../../components/ReturnButton';
import { MANTENIMIENTOS, UNIDADES } from '../../data/demoData';
import { PALETTE } from '../../theme/palette';
import { leerIdPositivo } from '../../utils/routeParams';

/** Ruta /mantenimientos/1, /mantenimientos/2 ... : detalle de una orden (lado N). */
export default function DetalleMantenimientoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const mantenimientoId = leerIdPositivo(id); // 'abc' -> null
    const mantenimiento = MANTENIMIENTOS.find((m) => m.id === mantenimientoId);

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
    const unidad = UNIDADES.find((u) => u.id === mantenimiento.unidadEquipoId);

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

            <Text style={styles.pie}>Se navega con identificadores, no copiando objetos completos.</Text>
        </ScrollView>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

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
    subtitulo: { fontSize: 17, fontWeight: '800', marginTop: 24, color: PALETTE.principal },
    dato: { marginTop: 8, color: PALETTE.secundario, lineHeight: 22 },
    accion: { marginTop: 16, backgroundColor: PALETTE.acentoClaro, padding: 16, borderRadius: 12 },
    accionTexto: { color: PALETTE.principal, fontWeight: '700', textAlign: 'center' },
    pie: { marginTop: 22, textAlign: 'center', color: PALETTE.secundario, fontSize: 12 },
});