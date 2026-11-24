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
import { MantenimientoRemotoCard } from '../../../components/MantenimientoRemotoCard';
import { ReturnButton } from '../../../components/ReturnButton';
import { nombreEquipo } from '../../../data/catalogoEquipos';
import { HttpError, mensajeDeError } from '../../../infra/http/apiClient';
import { mantenimientosApi, type MantenimientoDto } from '../../../infra/http/mantenimientosApi';
import { unidadesApi, type UnidadEquipoDto } from '../../../infra/http/unidadesApi';
import { PALETTE } from '../../../theme/palette';
import { formatearCatalogo, formatearFecha } from '../../../utils/formato';
import { leerIdPositivo } from '../../../utils/routeParams';

/**
 * Ruta /remoto/unidades/[id] (Guía 09): ficha PERSISTIDA, editar y eliminar.
 * DELETE devuelve 409 si la unidad tiene mantenimientos: la regla 1:N la
 * hace cumplir el SERVIDOR, no solo el móvil.
 * Guía 10: lista sus N órdenes con GET /api/mantenimientos/unidad-equipo/{id}.
 */
export default function DetalleUnidadRemotaScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const unidadId = leerIdPositivo(id);

    const [unidad, setUnidad] = useState<UnidadEquipoDto | null>(null);
    const [ordenes, setOrdenes] = useState<MantenimientoDto[]>([]);
    const [cargando, setCargando] = useState(unidadId !== null);
    const [error, setError] = useState<string | null>(null);
    const [noEncontrada, setNoEncontrada] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const cargar = useCallback(async () => {
        if (unidadId === null) return;
        setCargando(true);
        setError(null);
        setNoEncontrada(false);
        try {
            // Las dos consultas se hacen en paralelo: lado 1 y sus N órdenes.
            const [dto, lista] = await Promise.all([
                unidadesApi.obtener(unidadId),
                mantenimientosApi.porUnidad(unidadId),
            ]);
            setUnidad(dto);
            setOrdenes(lista);
        } catch (e) {
            if (e instanceof HttpError && e.status === 404) setNoEncontrada(true);
            else setError(mensajeDeError(e));
        } finally {
            setCargando(false);
        }
    }, [unidadId]);

    // Se recarga al volver de la edición para mostrar los datos guardados.
    useFocusEffect(
        useCallback(() => {
            void cargar();
        }, [cargar])
    );

    function confirmarEliminar() {
        if (!unidad || eliminando) return;
        Alert.alert('Eliminar de PostgreSQL', `¿Eliminar la unidad ${unidad.numeroSerie}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: () => void eliminar(unidad.id),
            },
        ]);
    }

    async function eliminar(idUnidad: number) {
        setEliminando(true);
        try {
            await unidadesApi.eliminar(idUnidad); // 204 No Content
            router.replace('/remoto/unidades');
        } catch (e) {
            Alert.alert('No fue posible eliminar', mensajeDeError(e));
        } finally {
            setEliminando(false);
        }
    }

    if (unidadId === null || noEncontrada) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/remoto/unidades" />
                <EmptyState mensaje="No existe esa unidad en PostgreSQL (404) o su ID no es válido." />
            </View>
        );
    }

    if (cargando && !unidad) {
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
                    onPress={() => void cargar()}
                    accessibilityRole="button"
                    accessibilityLabel="Reintentar conexión"
                    style={styles.reintentar}
                >
                    <Text style={styles.reintentarTexto}>Reintentar conexión</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/remoto/unidades" />

            <View style={styles.ficha}>
                <Text style={styles.codigo}>ID BD {unidad.id} · {unidad.numeroSerie}</Text>
                <Text style={styles.titulo}>{nombreEquipo(unidad.equipoId)}</Text>
                <Fila etiqueta="Estado operativo" valor={formatearCatalogo(unidad.estadoOperativo)} lima />
                <Fila etiqueta="Uso acumulado" valor={`${unidad.metricaUsoAcumulada} h`} />
                <Fila etiqueta="Registro" valor={unidad.activo ? 'ACTIVA' : 'INACTIVA'} />
                <Fila etiqueta="Creada" valor={formatearFecha(unidad.createdAt)} />
                <Text style={styles.notas}>{unidad.notasEstado ?? 'Sin notas de estado.'}</Text>
            </View>

            <Link href={{ pathname: '/remoto/unidades/editar/[id]', params: { id: String(unidad.id) } }} asChild>
                <Pressable
                    style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
                    accessibilityRole="link"
                    accessibilityLabel="Editar unidad remota"
                >
                    <Text style={styles.botonTexto}>Editar en PostgreSQL</Text>
                </Pressable>
            </Link>
            <Pressable
                onPress={confirmarEliminar}
                disabled={eliminando}
                style={({ pressed }) => [styles.peligro, (pressed || eliminando) && styles.presionado]}
                accessibilityRole="button"
                accessibilityLabel="Eliminar unidad remota"
            >
                {eliminando ? (
                    <ActivityIndicator color={PELIGRO} />
                ) : (
                    <Text style={styles.peligroTexto}>Eliminar en PostgreSQL</Text>
                )}
            </Pressable>

            <Text style={styles.subtitulo}>Órdenes de mantenimiento (1:N) · {ordenes.length}</Text>
            <Link
                href={{ pathname: '/remoto/mantenimientos/nuevo', params: { unidadId: String(unidad.id) } }}
                asChild
            >
                <Pressable
                    style={({ pressed }) => [styles.secundario, pressed && styles.presionado]}
                    accessibilityRole="link"
                    accessibilityLabel="Nueva orden para esta unidad"
                >
                    <Text style={styles.secundarioTexto}>+ Nueva orden para esta unidad</Text>
                </Pressable>
            </Link>
            {ordenes.length === 0 ? (
                <EmptyState mensaje="Esta unidad no tiene órdenes en PostgreSQL: se puede eliminar." />
            ) : (
                ordenes.map((orden) => (
                    <MantenimientoRemotoCard
                        key={orden.id}
                        mantenimiento={orden}
                        serieUnidad={unidad.numeroSerie}
                        alSeleccionar={() =>
                            router.push({
                                pathname: '/remoto/mantenimientos/[id]',
                                params: { id: String(orden.id) },
                            })
                        }
                    />
                ))
            )}

            <Text style={styles.pie}>
                Si la unidad tiene órdenes, el backend rechaza la eliminación con 409.
            </Text>
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
    ficha: {
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderLeftWidth: 3,
        borderLeftColor: PALETTE.acento,
        borderRadius: 12,
        padding: 16,
    },
    codigo: { fontFamily: MONO, color: PALETTE.lima, fontWeight: '700' },
    titulo: { marginTop: 6, fontSize: 22, color: PALETTE.principal, fontWeight: '800' },
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
    notas: { marginTop: 12, color: PALETTE.secundario, fontStyle: 'italic', lineHeight: 20 },
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
    subtitulo: { fontSize: 17, fontWeight: '800', marginTop: 24, marginBottom: 12, color: PALETTE.principal },
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
    pie: { color: PALETTE.secundario, textAlign: 'center', marginTop: 16, fontSize: 12, lineHeight: 18 },
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
