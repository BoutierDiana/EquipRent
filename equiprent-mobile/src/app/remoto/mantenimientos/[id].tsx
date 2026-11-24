import React, { useCallback, useState } from 'react';
import { Link, useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { ReturnButton } from '../../../components/ReturnButton';
import { nombreEquipo } from '../../../data/catalogoEquipos';
import { HttpError, mensajeDeError } from '../../../infra/http/apiClient';
import { mantenimientosApi, type MantenimientoDto } from '../../../infra/http/mantenimientosApi';
import { unidadesApi, type UnidadEquipoDto } from '../../../infra/http/unidadesApi';
import { PALETTE } from '../../../theme/palette';
import { formatearCatalogo, formatearFecha } from '../../../utils/formato';
import { leerIdPositivo } from '../../../utils/routeParams';

/** Ruta /remoto/mantenimientos/[id] (Guía 10): detalle de la orden y su unidad (lado 1). */
export default function DetalleOrdenRemotaScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const ordenId = leerIdPositivo(id);

    const [orden, setOrden] = useState<MantenimientoDto | null>(null);
    const [unidad, setUnidad] = useState<UnidadEquipoDto | null>(null);
    const [cargando, setCargando] = useState(ordenId !== null);
    const [error, setError] = useState<string | null>(null);
    const [noEncontrada, setNoEncontrada] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const cargar = useCallback(async () => {
        if (ordenId === null) return;
        setCargando(true);
        setError(null);
        setNoEncontrada(false);
        try {
            const dto = await mantenimientosApi.obtener(ordenId);
            setOrden(dto);
            // Lado 1: la unidad dueña de la orden (por la clave foránea).
            setUnidad(await unidadesApi.obtener(dto.unidadEquipoId).catch(() => null));
        } catch (e) {
            if (e instanceof HttpError && e.status === 404) setNoEncontrada(true);
            else setError(mensajeDeError(e));
        } finally {
            setCargando(false);
        }
    }, [ordenId]);

    useFocusEffect(
        useCallback(() => {
            void cargar();
        }, [cargar])
    );

    function confirmarEliminar() {
        if (!orden || eliminando) return;
        Alert.alert('Eliminar de PostgreSQL', `¿Eliminar la orden #${orden.id}?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => void eliminar(orden.id) },
        ]);
    }

    async function eliminar(idOrden: number) {
        setEliminando(true);
        try {
            await mantenimientosApi.eliminar(idOrden); // 204
            router.replace('/remoto/mantenimientos');
        } catch (e) {
            Alert.alert('No fue posible eliminar', mensajeDeError(e));
        } finally {
            setEliminando(false);
        }
    }

    if (ordenId === null || noEncontrada) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/remoto/mantenimientos" />
                <EmptyState mensaje="No existe esa orden en PostgreSQL (404) o su ID no es válido." />
            </View>
        );
    }

    if (cargando && !orden) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
            </View>
        );
    }

    if (error || !orden) {
        return (
            <View style={styles.centro}>
                <Text style={styles.errorTitulo}>Error de Comunicación</Text>
                <Text style={styles.errorTexto}>{error}</Text>
                <Pressable onPress={() => void cargar()} accessibilityRole="button" style={styles.reintentar}>
                    <Text style={styles.reintentarTexto}>Reintentar conexión</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/remoto/mantenimientos" />
            <Text style={styles.etiqueta}>ORDEN #{orden.id} · POSTGRESQL</Text>
            <Text style={styles.titulo}>Mantenimiento {orden.tipo}</Text>

            <View style={styles.ficha}>
                <Fila etiqueta="Estado" valor={formatearCatalogo(orden.estado)} lima />
                <Fila etiqueta="Ingreso" valor={formatearFecha(orden.fechaIngreso)} />
                <Fila etiqueta="Egreso estimado" valor={formatearFecha(orden.fechaEgresoEstimada)} />
                <Fila etiqueta="Egreso real" valor={formatearFecha(orden.fechaEgresoReal)} />
                <Fila etiqueta="Registrada" valor={formatearFecha(orden.createdAt)} />
            </View>

            <Link href={{ pathname: '/remoto/mantenimientos/editar/[id]', params: { id: String(orden.id) } }} asChild>
                <Pressable
                    style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
                    accessibilityRole="link"
                    accessibilityLabel="Editar orden remota"
                >
                    <Text style={styles.botonTexto}>Editar en PostgreSQL</Text>
                </Pressable>
            </Link>
            <Pressable
                onPress={confirmarEliminar}
                disabled={eliminando}
                style={({ pressed }) => [styles.peligro, (pressed || eliminando) && styles.presionado]}
                accessibilityRole="button"
                accessibilityLabel="Eliminar orden remota"
            >
                {eliminando ? (
                    <ActivityIndicator color={PELIGRO} />
                ) : (
                    <Text style={styles.peligroTexto}>Eliminar en PostgreSQL</Text>
                )}
            </Pressable>

            <Text style={styles.subtitulo}>Unidad de equipo asociada (lado 1)</Text>
            <Text style={styles.dato}>
                {unidad
                    ? `${unidad.numeroSerie} · ${nombreEquipo(unidad.equipoId)}`
                    : `Unidad #${orden.unidadEquipoId}`}
            </Text>
            <Link
                href={{ pathname: '/remoto/unidades/[id]', params: { id: String(orden.unidadEquipoId) } }}
                asChild
            >
                <Pressable style={styles.accion} accessibilityRole="link">
                    <Text style={styles.accionTexto}>Ver ficha de la unidad</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}

function Fila({ etiqueta, valor, lima = false }: { etiqueta: string; valor: string; lima?: boolean }) {
    return (
        <View style={styles.filaDato}>
            <Text style={styles.datoEtiqueta}>{etiqueta}:</Text>
            <Text style={lima ? styles.datoLima : styles.datoValor}>{valor}</Text>
        </View>
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
    filaDato: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12 },
    datoEtiqueta: { color: PALETTE.secundario },
    datoValor: { fontFamily: MONO, color: PALETTE.principal },
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
    presionado: { opacity: 0.7 },
    subtitulo: { fontSize: 17, fontWeight: '800', marginTop: 24, color: PALETTE.principal },
    dato: { marginTop: 8, color: PALETTE.secundario, lineHeight: 22 },
    accion: { marginTop: 12, backgroundColor: PALETTE.acentoClaro, padding: 16, borderRadius: 12 },
    accionTexto: { color: PALETTE.principal, fontWeight: '700', textAlign: 'center' },
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    errorTitulo: { color: PELIGRO, fontSize: 20, fontWeight: '800' },
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
