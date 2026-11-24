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
import { ReturnButton } from '../../../components/ReturnButton';
import { UnidadRemotaCard } from '../../../components/UnidadRemotaCard';
import { mensajeDeError } from '../../../infra/http/apiClient';
import { unidadesApi, type UnidadEquipoDto } from '../../../infra/http/unidadesApi';
import { PALETTE } from '../../../theme/palette';

/**
 * Ruta /remoto/unidades (Guía 09): catálogo PERSISTIDO en PostgreSQL.
 * useFocusEffect vuelve a pedir la lista cada vez que la pantalla recibe el foco,
 * así al volver de crear, editar o eliminar se ve el estado real de la base de datos.
 * Estados: LOADING · ERROR (+ reintentar) · EMPTY (200 con []) · SUCCESS.
 */
export default function UnidadesRemotasScreen() {
    const router = useRouter();
    const [unidades, setUnidades] = useState<UnidadEquipoDto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [refrescando, setRefrescando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const cargar = useCallback(async (modo: 'inicial' | 'refresco') => {
        if (modo === 'inicial') setCargando(true);
        else setRefrescando(true);
        setError(null);
        try {
            setUnidades(await unidadesApi.listar());
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
            data={unidades}
            keyExtractor={(u) => String(u.id)}
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
                    <Text style={styles.titulo}>Unidades en PostgreSQL</Text>
                    <Text style={styles.ayuda}>CRUD REST real: los cambios sobreviven al recargar la app.</Text>
                    <Link href="/remoto/unidades/nuevo" asChild>
                        <Pressable
                            style={({ pressed }) => [styles.nuevo, pressed && styles.presionado]}
                            accessibilityRole="link"
                            accessibilityLabel="Registrar unidad remota"
                        >
                            <Text style={styles.nuevoTexto}>+ Registrar unidad REMOTA</Text>
                        </Pressable>
                    </Link>
                </View>
            }
            renderItem={({ item }) => (
                <UnidadRemotaCard
                    unidad={item}
                    alSeleccionar={() =>
                        router.push({ pathname: '/remoto/unidades/[id]', params: { id: String(item.id) } })
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
