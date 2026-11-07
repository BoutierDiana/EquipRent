import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ReturnButton } from '../../components/ReturnButton';
import { UnidadEquipoCard } from '../../components/UnidadEquipoCard';
import { MANTENIMIENTOS } from '../../data/demoData';
import type { UnidadEquipo } from '../../models/equiprent';
import { unidadesService } from '../../services/unidadesService';
import { PALETTE } from '../../theme/palette';

/**
 * Ruta /unidades : catálogo consumido desde GET /api/unidades-equipo.
 * Estados de la pantalla:
 *  - LOADING: cargando === true            -> ActivityIndicator
 *  - ERROR:   error !== null               -> mensaje + "Reintentar conexión"
 *  - EMPTY:   200 OK con []                -> ListEmptyComponent (EmptyState)
 *  - SUCCESS: 200 OK con registros         -> FlatList de tarjetas
 */
export default function UnidadesScreen() {
    const router = useRouter();
    const [unidades, setUnidades] = useState<UnidadEquipo[]>([]);
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // La pantalla NO conoce la URL: solo pide datos al servicio.
    const cargarDatos = useCallback(async () => {
        setCargando(true);
        setError(null);
        try {
            const datos = await unidadesService.obtenerTodas();
            setUnidades(datos);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido al cargar las unidades.');
        } finally {
            setCargando(false);
        }
    }, []);

    // Pull-to-Refresh: repite el GET sin ocultar la lista actual.
    const alRefrescar = useCallback(async () => {
        setRefrescando(true);
        setError(null);
        try {
            const datos = await unidadesService.obtenerTodas();
            setUnidades(datos);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error desconocido al refrescar.');
        } finally {
            setRefrescando(false);
        }
    }, []);

    // Se ejecuta una sola vez al montar la pantalla.
    useEffect(() => {
        void cargarDatos();
    }, [cargarDatos]);

    if (cargando) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
                <Text style={styles.cargandoTexto}>Sincronizando con el backend...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centro}>
                <Text style={styles.errorTitulo}>Error de Comunicación</Text>
                <Text style={styles.errorTexto}>{error}</Text>
                <Pressable
                    onPress={() => void cargarDatos()}
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
            data={unidades}
            keyExtractor={(unidad) => String(unidad.id)}
            contentContainerStyle={styles.contenido}
            refreshControl={
                <RefreshControl
                    refreshing={refrescando}
                    onRefresh={alRefrescar}
                    colors={[PALETTE.acento]}
                    tintColor={PALETTE.lima}
                    progressBackgroundColor={PALETTE.superficie}
                />
            }
            ListHeaderComponent={
                <View style={styles.encabezado}>
                    <ReturnButton destinoSiNoHayHistorial="/" />
                    <Text style={styles.titulo}>Catálogo de Maquinaria</Text>
                    <Text style={styles.ayuda}>
                        Activos operativos sincronizados en tiempo real mediante API REST.
                    </Text>
                </View>
            }
            renderItem={({ item }) => (
                <UnidadEquipoCard
                    unidad={item}
                    cantidadMantenimientos={
                        MANTENIMIENTOS.filter((m) => m.unidadEquipoId === item.id).length
                    }
                    seleccionada={false}
                    // La pantalla decide el efecto: abrir la ficha enviando solo el ID.
                    alSeleccionar={() =>
                        router.push({ pathname: '/unidades/[id]', params: { id: String(item.id) } })
                    }
                />
            )}
            ListEmptyComponent={
                <EmptyState mensaje="El servidor respondió correctamente, pero no hay unidades de equipo registradas." />
            }
            ListFooterComponent={
                unidades.length > 0 ? (
                    <Text style={styles.pie}>Desliza hacia abajo para recargar · GET /api/unidades-equipo</Text>
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