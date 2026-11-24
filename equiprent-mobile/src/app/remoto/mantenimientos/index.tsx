import React, { useCallback, useState } from 'react';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { MantenimientoRemotoCard } from '../../../components/MantenimientoRemotoCard';
import { ReturnButton } from '../../../components/ReturnButton';
import { mensajeDeError } from '../../../infra/http/apiClient';
import { mantenimientosApi, type MantenimientoDto } from '../../../infra/http/mantenimientosApi';
import { unidadesApi } from '../../../infra/http/unidadesApi';
import { PALETTE } from '../../../theme/palette';

/**
 * Ruta /remoto/mantenimientos (Guía 10): todas las órdenes PERSISTIDAS.
 * Se piden en paralelo órdenes y unidades (Promise.all) para mostrar el
 * número de serie del lado 1 en cada tarjeta.
 */
export default function MantenimientosRemotosScreen() {
    const router = useRouter();
    const [ordenes, setOrdenes] = useState<MantenimientoDto[]>([]);
    const [series, setSeries] = useState<Record<number, string>>({});
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async (modo: 'inicial' | 'refresco') => {
        if (modo === 'inicial') setCargando(true);
        else setRefrescando(true);
        setError(null);
        try {
            const [listaOrdenes, listaUnidades] = await Promise.all([
                mantenimientosApi.listar(),
                unidadesApi.listar(),
            ]);
            setOrdenes(listaOrdenes);
            setSeries(Object.fromEntries(listaUnidades.map((u) => [u.id, u.numeroSerie])));
        } catch (e) {
            setError(mensajeDeError(e));
        } finally {
            setCargando(false);
            setRefrescando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void cargar('inicial');
        }, [cargar])
    );

    if (cargando) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
                <Text style={styles.cargandoTexto}>Consultando órdenes de taller...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centro}>
                <Text style={styles.errorTitulo}>Error de Comunicación</Text>
                <Text style={styles.errorTexto}>{error}</Text>
                <Pressable
                    onPress={() => void cargar('inicial')}
                    accessibilityRole="button"
                    accessibilityLabel="Reintentar conexión"
                    style={({ pressed }) => [styles.reintentar, pressed && styles.presionado]}
                >
                    <Text style={styles.reintentarTexto}>Reintentar conexión</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <FlatList
            data={ordenes}
            keyExtractor={(m) => String(m.id)}
            contentContainerStyle={styles.contenido}
            refreshControl={
                <RefreshControl
                    refreshing={refrescando}
                    onRefresh={() => void cargar('refresco')}
                    colors={[PALETTE.acento]}
                    tintColor={PALETTE.lima}
                    progressBackgroundColor={PALETTE.superficie}
                />
            }
            ListHeaderComponent={
                <View style={styles.encabezado}>
                    <ReturnButton destinoSiNoHayHistorial="/remoto" />
                    <Text style={styles.titulo}>Órdenes en PostgreSQL</Text>
                    <Text style={styles.ayuda}>Lado N de la relación: cada orden pertenece a una unidad.</Text>
                    <Link href="/remoto/mantenimientos/nuevo" asChild>
                        <Pressable
                            style={({ pressed }) => [styles.nuevo, pressed && styles.presionado]}
                            accessibilityRole="link"
                            accessibilityLabel="Registrar orden remota"
                        >
                            <Text style={styles.nuevoTexto}>+ Nueva orden REMOTA</Text>
                        </Pressable>
                    </Link>
                </View>
            }
            renderItem={({ item }) => (
                <MantenimientoRemotoCard
                    mantenimiento={item}
                    serieUnidad={series[item.unidadEquipoId] ?? `Unidad #${item.unidadEquipoId}`}
                    alSeleccionar={() =>
                        router.push({ pathname: '/remoto/mantenimientos/[id]', params: { id: String(item.id) } })
                    }
                />
            )}
            ListEmptyComponent={<EmptyState mensaje="No hay órdenes de mantenimiento registradas." />}
            ListFooterComponent={
                ordenes.length > 0 ? (
                    <Text style={styles.pie}>Desliza hacia abajo para recargar · GET /api/mantenimientos</Text>
                ) : null
            }
        />
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 36, flexGrow: 1 },
    encabezado: { marginBottom: 12 },
    titulo: { fontSize: 23, fontWeight: '800', color: PALETTE.principal },
    ayuda: { marginTop: 8, color: PALETTE.secundario, lineHeight: 21 },
    nuevo: {
        marginTop: 16,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    nuevoTexto: { color: PALETTE.principal, fontWeight: '800', letterSpacing: 1 },
    pie: { textAlign: 'center', color: PALETTE.acento, marginTop: 12, fontSize: 12 },
    centro: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: PALETTE.fondo,
    },
    cargandoTexto: { marginTop: 14, color: PALETTE.secundario },
    errorTitulo: { color: '#f87171', fontSize: 20, fontWeight: '800' },
    errorTexto: { marginTop: 10, color: PALETTE.secundario, textAlign: 'center', lineHeight: 20 },
    reintentar: {
        marginTop: 20,
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 22,
    },
    presionado: { opacity: 0.85 },
    reintentarTexto: { color: PALETTE.principal, fontWeight: '800' },
});
