import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { ReturnButton } from '../../../components/ReturnButton';
import { UnidadRemotaForm } from '../../../components/UnidadRemotaForm';
import type { UnidadRemotaFormulario } from '../../../domain/validaciones';
import { aActualizarRequest, aFormulario, type UnidadEquipoDto } from '../../../infra/http/unidadesApi';
import {
    buscarEnCache,
    buscarPendiente,
    dejarPendiente,
    descartarPendiente,
    type Pendiente,
} from '../../../offline/cache';
import { PALETTE } from '../../../theme/palette';
import { leerIdPositivo } from '../../../utils/routeParams';

/**
 * Ruta /remoto/offline/[id] (Guía 12): edita una unidad del caché SIN red.
 * El cambio NO va al servidor: queda en la cola pending_updates de SQLite.
 */
export default function EditarOfflineScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const unidadId = leerIdPositivo(id);

    const [unidad, setUnidad] = useState<UnidadEquipoDto | null>(null);
    const [pendiente, setPendiente] = useState<Pendiente | null>(null);
    const [error, setError] = useState<string | null>(unidadId === null ? 'ID de unidad no válido.' : null);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        if (unidadId === null) return;
        let vigente = true;
        Promise.all([buscarEnCache(unidadId), buscarPendiente(unidadId)])
            .then(([u, p]) => {
                if (!vigente) return;
                if (!u) setError('La unidad no está en el caché. Vuelve a descargar.');
                setUnidad(u);
                setPendiente(p);
            })
            .catch((e: unknown) => vigente && setError(`SQLite: ${e instanceof Error ? e.message : 'error'}`));
        return () => {
            vigente = false;
        };
    }, [unidadId]);

    async function guardar(datos: UnidadRemotaFormulario) {
        if (!unidad) return;
        setEnviando(true);
        try {
            await dejarPendiente(unidad, aActualizarRequest(datos));
            router.replace('/remoto/offline');
        } catch (e) {
            Alert.alert('SQLite', e instanceof Error ? e.message : 'No se pudo guardar el pendiente.');
        } finally {
            setEnviando(false);
        }
    }

    async function descartar() {
        if (!unidad) return;
        await descartarPendiente(unidad.id);
        router.replace('/remoto/offline');
    }

    if (error) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/remoto/offline" />
                <EmptyState mensaje={error} />
            </View>
        );
    }

    if (!unidad) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
                <Text style={styles.cargando}>Buscando la unidad en SQLite...</Text>
            </View>
        );
    }

    // Si ya había un cambio pendiente, el formulario parte de él (no del caché).
    const inicial = pendiente
        ? aFormulario({ ...unidad, ...pendiente.cambios })
        : aFormulario(unidad);

    return (
        <KeyboardAvoidingView style={styles.pantalla} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <ReturnButton destinoSiNoHayHistorial="/remoto/offline" />
                <Text style={styles.aviso}>
                    Edición sin conexión: el cambio se guarda en el teléfono y se envía al pulsar
                    «Sincronizar».
                </Text>
                {pendiente?.conflicto && (
                    <View style={styles.cajaConflicto}>
                        <Text style={styles.conflicto}>{pendiente.conflicto}</Text>
                        <Text style={styles.conflictoAyuda}>
                            Descarta tu cambio, vuelve a descargar y edita sobre la versión actual del servidor.
                        </Text>
                    </View>
                )}
                <UnidadRemotaForm
                    key={unidad.id}
                    valorInicial={inicial}
                    mostrarActivo
                    textoBoton="Guardar cambio PENDIENTE"
                    enviando={enviando}
                    alGuardar={(datos) => void guardar(datos)}
                />
                {pendiente && (
                    <Pressable
                        onPress={() => void descartar()}
                        accessibilityRole="button"
                        accessibilityLabel="Descartar cambio pendiente"
                        style={styles.descartar}
                    >
                        <Text style={styles.descartarTexto}>Descartar cambio pendiente</Text>
                    </Pressable>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
    contenido: { padding: 18, paddingBottom: 40 },
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    cargando: { marginTop: 12, color: PALETTE.secundario },
    aviso: { color: PALETTE.secundario, lineHeight: 20, marginBottom: 12 },
    cajaConflicto: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.inactivo,
        backgroundColor: PALETTE.inactivoClaro,
        marginBottom: 12,
    },
    conflicto: { color: PALETTE.inactivo, fontWeight: '800' },
    conflictoAyuda: { color: PALETTE.principal, marginTop: 6, lineHeight: 19 },
    descartar: {
        marginTop: 14,
        minHeight: 46,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f87171',
    },
    descartarTexto: { color: '#f87171', fontWeight: '800', textAlign: 'center' },
});
