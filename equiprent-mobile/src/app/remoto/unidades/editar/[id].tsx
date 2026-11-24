import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { EmptyState } from '../../../../components/EmptyState';
import { ReturnButton } from '../../../../components/ReturnButton';
import { UnidadRemotaForm } from '../../../../components/UnidadRemotaForm';
import type { UnidadRemotaFormulario } from '../../../../domain/validaciones';
import { HttpError, mensajeDeError } from '../../../../infra/http/apiClient';
import {
    aActualizarRequest,
    aFormulario,
    unidadesApi,
    type UnidadEquipoDto,
} from '../../../../infra/http/unidadesApi';
import { PALETTE } from '../../../../theme/palette';
import { leerIdPositivo } from '../../../../utils/routeParams';

/**
 * Ruta /remoto/unidades/editar/[id] (Guía 09): GET para precargar y PUT para guardar.
 * PUT /api/unidades-equipo/{id} -> 200 | 400 | 404 | 409 (serie de otra unidad).
 */
export default function EditarUnidadRemotaScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const unidadId = leerIdPositivo(id);

    const [unidad, setUnidad] = useState<UnidadEquipoDto | null>(null);
    const [error, setError] = useState<string | null>(unidadId === null ? 'ID de unidad no válido.' : null);
    const [enviando, setEnviando] = useState(false);
    const [erroresServidor, setErroresServidor] = useState<Record<string, string>>({});

    useEffect(() => {
        if (unidadId === null) return;
        let vigente = true; // evita actualizar el estado si la pantalla ya se cerró
        unidadesApi
            .obtener(unidadId)
            .then((dto) => vigente && setUnidad(dto))
            .catch((e: unknown) => vigente && setError(mensajeDeError(e)));
        return () => {
            vigente = false;
        };
    }, [unidadId]);

    async function guardar(datos: UnidadRemotaFormulario) {
        if (!unidad) return;
        setEnviando(true);
        setErroresServidor({});
        try {
            await unidadesApi.actualizar(unidad.id, aActualizarRequest(datos));
            router.replace({ pathname: '/remoto/unidades/[id]', params: { id: String(unidad.id) } });
        } catch (e) {
            if (e instanceof HttpError) setErroresServidor(e.fieldErrors);
            Alert.alert('No se guardó', mensajeDeError(e));
        } finally {
            setEnviando(false);
        }
    }

    if (error) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/remoto/unidades" />
                <EmptyState mensaje={error} />
            </View>
        );
    }

    if (!unidad) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
                <Text style={styles.cargando}>Cargando datos actuales...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <UnidadRemotaForm
                    key={unidad.id}
                    valorInicial={aFormulario(unidad)}
                    mostrarActivo
                    textoBoton="Actualizar en PostgreSQL"
                    enviando={enviando}
                    erroresServidor={erroresServidor}
                    alGuardar={(datos) => void guardar(datos)}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
    contenido: { padding: 18, paddingBottom: 40 },
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    cargando: { marginTop: 12, color: PALETTE.secundario },
});
