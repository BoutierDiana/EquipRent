import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ReturnButton } from '../components/ReturnButton';
import { API_BASE_URL, HttpError } from '../infra/http/apiClient';
import { healthApi, type ResultadoSalud } from '../infra/http/healthApi';
import { PALETTE } from '../theme/palette';

type Estado =
    | { tipo: 'INICIAL' }
    | { tipo: 'CARGANDO' }
    | { tipo: 'EXITO'; resultado: ResultadoSalud }
    | { tipo: 'ERROR'; mensaje: string };

/**
 * Ruta /diagnostico (Guía 08): comprueba la conexión REAL Android -> Spring Boot.
 * Abrir Swagger o /api/health en el navegador de la PC NO demuestra que el
 * emulador llegue al backend: esta pantalla sí lo hace.
 */
export default function DiagnosticoScreen() {
    const [estado, setEstado] = useState<Estado>({ tipo: 'INICIAL' });

    async function probar() {
        setEstado({ tipo: 'CARGANDO' });
        try {
            setEstado({ tipo: 'EXITO', resultado: await healthApi.consultar() });
        } catch (e) {
            const mensaje =
                e instanceof HttpError
                    ? `HTTP ${e.status}: ${e.message}`
                    : e instanceof Error
                      ? e.message
                      : 'Error no identificado.';
            setEstado({ tipo: 'ERROR', mensaje });
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/" />
            <Text style={styles.titulo}>Diagnóstico REST</Text>

            <View style={styles.ficha}>
                <Text style={styles.etiqueta}>URL EFECTIVA</Text>
                <Text selectable style={styles.mono}>{API_BASE_URL}</Text>
                <Text style={styles.ayuda}>
                    En el emulador Android, 10.0.2.2 apunta a la PC anfitriona. En un teléfono
                    físico usa la IP de tu PC en el Wi-Fi (archivo .env.local).
                </Text>
            </View>

            <Pressable
                onPress={() => void probar()}
                disabled={estado.tipo === 'CARGANDO'}
                accessibilityRole="button"
                accessibilityLabel="Probar GET /api/health"
                style={({ pressed }) => [
                    styles.boton,
                    (pressed || estado.tipo === 'CARGANDO') && styles.presionado,
                ]}
            >
                <Text style={styles.botonTexto}>Probar GET /api/health</Text>
            </Pressable>

            {estado.tipo === 'CARGANDO' && (
                <ActivityIndicator style={styles.spinner} size="large" color={PALETTE.lima} />
            )}

            {estado.tipo === 'INICIAL' && (
                <Text style={styles.ayuda}>Todavía no se hizo la prueba.</Text>
            )}

            {estado.tipo === 'EXITO' && (
                <View style={[styles.resultado, styles.resultadoOk]}>
                    <Text style={styles.ok}>CONECTADO · HTTP 200</Text>
                    <Fila etiqueta="status" valor={estado.resultado.salud.status} />
                    <Fila etiqueta="application" valor={estado.resultado.salud.application} />
                    <Fila etiqueta="stage" valor={estado.resultado.salud.stage} />
                    <Fila etiqueta="timestamp" valor={estado.resultado.salud.timestamp} />
                    <Fila etiqueta="latencia" valor={`${estado.resultado.latenciaMs} ms`} />
                </View>
            )}

            {estado.tipo === 'ERROR' && (
                <View style={[styles.resultado, styles.resultadoError]}>
                    <Text style={styles.error}>SIN CONEXIÓN</Text>
                    <Text selectable style={styles.errorTexto}>{estado.mensaje}</Text>
                    <Text style={styles.ayuda}>
                        Revisa: backend encendido en el puerto 8080, URL del .env.local y que
                        Metro se reinició después de cambiarla.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
    return (
        <View style={styles.fila}>
            <Text style={styles.filaEtiqueta}>{etiqueta}</Text>
            <Text selectable style={styles.filaValor}>{valor}</Text>
        </View>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
const ROJO = '#f87171';

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 40 },
    titulo: { fontSize: 23, fontWeight: '800', color: PALETTE.principal },
    ficha: {
        marginTop: 16,
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 12,
        padding: 16,
    },
    etiqueta: { color: PALETTE.acento, fontWeight: '800', letterSpacing: 1, fontSize: 12 },
    mono: { marginTop: 6, fontFamily: MONO, color: PALETTE.lima, fontWeight: '700' },
    ayuda: { marginTop: 12, color: PALETTE.secundario, lineHeight: 20 },
    boton: {
        marginTop: 20,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    presionado: { opacity: 0.7 },
    botonTexto: { color: PALETTE.principal, fontWeight: '800', letterSpacing: 1 },
    spinner: { marginTop: 20 },
    resultado: { marginTop: 20, borderRadius: 12, borderWidth: 1, padding: 16 },
    resultadoOk: { borderColor: PALETTE.lima, backgroundColor: PALETTE.superficie },
    resultadoError: { borderColor: ROJO, backgroundColor: PALETTE.superficie },
    ok: { color: PALETTE.lima, fontWeight: '800', letterSpacing: 1 },
    error: { color: ROJO, fontWeight: '800', letterSpacing: 1 },
    errorTexto: { marginTop: 8, color: PALETTE.principal, lineHeight: 20 },
    fila: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: PALETTE.acentoClaro,
    },
    filaEtiqueta: { color: PALETTE.secundario, fontFamily: MONO },
    filaValor: { flexShrink: 1, textAlign: 'right', color: PALETTE.principal, fontFamily: MONO },
});
