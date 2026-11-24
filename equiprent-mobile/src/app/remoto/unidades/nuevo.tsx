import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { UnidadRemotaForm } from '../../../components/UnidadRemotaForm';
import type { UnidadRemotaFormulario } from '../../../domain/validaciones';
import { HttpError, mensajeDeError } from '../../../infra/http/apiClient';
import { aActualizarRequest, unidadesApi } from '../../../infra/http/unidadesApi';
import { PALETTE } from '../../../theme/palette';

/**
 * Ruta /remoto/unidades/nuevo (Guía 09): POST /api/unidades-equipo.
 * 201 -> vuelve a la lista (que se recarga sola) · 400 -> errores bajo cada campo
 * · 409 -> número de serie repetido en PostgreSQL.
 */
export default function NuevaUnidadRemotaScreen() {
    const router = useRouter();
    const [enviando, setEnviando] = useState(false);
    const [erroresServidor, setErroresServidor] = useState<Record<string, string>>({});

    async function guardar(datos: UnidadRemotaFormulario) {
        setEnviando(true);
        setErroresServidor({});
        try {
            // Al crear no se envía "activo": el backend crea toda unidad activa.
            const { activo: _activo, ...cuerpo } = aActualizarRequest(datos);
            await unidadesApi.crear(cuerpo);
            router.replace('/remoto/unidades');
        } catch (e) {
            if (e instanceof HttpError) setErroresServidor(e.fieldErrors);
            Alert.alert('No se guardó', mensajeDeError(e));
        } finally {
            setEnviando(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <UnidadRemotaForm
                    textoBoton="Guardar en PostgreSQL"
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
});
