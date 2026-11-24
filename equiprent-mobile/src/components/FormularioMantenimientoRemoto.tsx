import React, { useEffect, useState } from 'react';
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
import type { MantenimientoRemotoFormulario } from '../domain/validaciones';
import { HttpError, mensajeDeError } from '../infra/http/apiClient';
import { unidadesApi, type UnidadEquipoDto } from '../infra/http/unidadesApi';
import { PALETTE } from '../theme/palette';
import { EmptyState } from './EmptyState';
import { MantenimientoRemotoForm } from './MantenimientoRemotoForm';

type Props = {
    /** Valores iniciales; null mientras la pantalla de edición todavía los está cargando. */
    valorInicial: MantenimientoRemotoFormulario | null;
    textoBoton: string;
    /** Envía al backend; si lanza un error, este componente lo muestra. */
    enviar: (datos: MantenimientoRemotoFormulario) => Promise<void>;
};

/**
 * Pantalla-contenedor compartida por "nueva" y "editar" orden remota:
 * carga las unidades reales (lado 1), controla el estado "enviando" y
 * muestra los errores 400/404 del backend.
 */
export function FormularioMantenimientoRemoto({ valorInicial, textoBoton, enviar }: Props) {
    const [unidades, setUnidades] = useState<UnidadEquipoDto[] | null>(null);
    const [errorCarga, setErrorCarga] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [erroresServidor, setErroresServidor] = useState<Record<string, string>>({});

    useEffect(() => {
        let vigente = true;
        unidadesApi
            .listar()
            .then((lista) => vigente && setUnidades(lista))
            .catch((e: unknown) => vigente && setErrorCarga(mensajeDeError(e)));
        return () => {
            vigente = false;
        };
    }, []);

    async function guardar(datos: MantenimientoRemotoFormulario) {
        setEnviando(true);
        setErroresServidor({});
        try {
            await enviar(datos);
        } catch (e) {
            if (e instanceof HttpError) setErroresServidor(e.fieldErrors);
            Alert.alert('No se guardó', mensajeDeError(e));
        } finally {
            setEnviando(false);
        }
    }

    if (errorCarga) {
        return (
            <View style={styles.contenido}>
                <EmptyState mensaje={errorCarga} />
            </View>
        );
    }

    if (!unidades || !valorInicial) {
        return (
            <View style={styles.centro}>
                <ActivityIndicator size="large" color={PALETTE.lima} />
                <Text style={styles.cargando}>Cargando unidades y datos...</Text>
            </View>
        );
    }

    if (unidades.length === 0) {
        return (
            <View style={styles.contenido}>
                <EmptyState mensaje="No hay unidades en PostgreSQL. Registra una unidad antes de crear órdenes." />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.pantalla}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
                <MantenimientoRemotoForm
                    unidades={unidades}
                    valorInicial={valorInicial}
                    textoBoton={textoBoton}
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
