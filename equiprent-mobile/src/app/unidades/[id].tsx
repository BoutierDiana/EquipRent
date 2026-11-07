import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { MantenimientoNavegable } from '../../components/MantenimientoNavegable';
import { ReturnButton } from '../../components/ReturnButton';
import { MANTENIMIENTOS } from '../../data/demoData';
import type { UnidadEquipo } from '../../models/equiprent';
import { HttpError } from '../../services/apiClient';
import { unidadesService } from '../../services/unidadesService';
import { PALETTE } from '../../theme/palette';
import { leerIdPositivo } from '../../utils/routeParams';

/** Ruta /unidades/1, /unidades/2 ... : ficha de la unidad y sus N mantenimientos. */
export default function DetalleUnidadScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const unidadId = leerIdPositivo(id);

    const [unidad, setUnidad] = useState<UnidadEquipo | null>(null);
    const [cargando, setCargando] = useState(unidadId !== null);
    const [error, setError] = useState<string | null>(null);
    const [noEncontrada, setNoEncontrada] = useState(false);

    // El id de la ruta viaja al backend: GET /api/unidades-equipo/{id}
    const cargarDatos = useCallback(async () => {
        if (unidadId === null) {
            return;
        }
        setCargando(true);
        setError(null);
        setNoEncontrada(false);
        try {
            setUnidad(await unidadesService.obtenerPorId(unidadId));
        } catch (e) {
            if (e instanceof HttpError && e.status === 404) {
                setNoEncontrada(true); // error de DATOS, no de red
            } else {
                setError(e instanceof Error ? e.message : 'Error desconocido al cargar la unidad.');
            }
        } finally {
            setCargando(false);
        }
    }, [unidadId]);

    useEffect(() => {
        void cargarDatos();
    }, [cargarDatos]);

    // ID mal formado ('abc', '0', '-1'): se rechaza ANTES de consultar el backend.
    if (unidadId === null || noEncontrada) {
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

    if (cargando) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
            </View>
        );
    }

    if (error || !unidad) {
        return (
            <View style={styles.centro}>
                <Text style={styles.errorTitulo}>Error de Comunicación</Text>
                <Text style={styles.errorTexto}>{error}</Text>
                <Pressable
                    onPress={() => void cargarDatos()}
                    accessibilityRole="button"
                    accessibilityLabel="Reintentar conexión"
                    style={styles.reintentar}
                >
                    <Text style={styles.reintentarTexto}>Reintentar conexión</Text>
                </Pressable>
            </View>
        );
    }

    // Relación 1:N: los mantenimientos cuyo unidadEquipoId coincide con la unidad.
    // (Datos locales de demostración: el contrato del backend de Mantenimiento
    // todavía no incluye descripcion ni costo.)
    const mantenimientos = MANTENIMIENTOS.filter((m) => m.unidadEquipoId === unidad.id);

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
                    <Text style={styles.datoLima}>{unidad.estadoOperativo}</Text>
                </View>
                <View style={styles.filaDato}>
                    <Text style={styles.datoEtiqueta}>Registro:</Text>
                    <Text style={styles.datoValor}>{unidad.activo ? 'ACTIVA' : 'INACTIVA'}</Text>
                </View>
            </View>

            <Text style={styles.subtitulo}>
                Historial de Mantenimientos (1:N) · {mantenimientos.length}
            </Text>

            {mantenimientos.length === 0 ? (
                <EmptyState mensaje="Esta unidad no registra órdenes de taller preventivo ni correctivo." />
            ) : (
                mantenimientos.map((m) => (
                    <MantenimientoNavegable
                        key={m.id}
                        mantenimiento={m}
                        codigoUnidad={unidad.codigoInventario}
                    />
                ))
            )}

            <Text style={styles.pie}>Una unidad puede tener cero, uno o varios mantenimientos.</Text>
        </ScrollView>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

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
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    errorTitulo: { color: '#f87171', fontSize: 20, fontWeight: '800' },
    errorTexto: { marginTop: 10, color: PALETTE.secundario, textAlign: 'center', lineHeight: 20 },
    reintentar: {
        marginTop: 20,
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 22,
    },
    reintentarTexto: { color: PALETTE.principal, fontWeight: '800' },
});