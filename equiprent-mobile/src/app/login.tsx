import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { ReturnButton } from '../components/ReturnButton';
import { mensajeDeError } from '../infra/http/apiClient';
import { useAuth } from '../state/AuthContext';
import { PALETTE } from '../theme/palette';

/**
 * Ruta /login (Guía 11): POST /api/auth/login y guarda el JWT en SecureStore.
 * La contraseña solo vive en el estado de esta pantalla: nunca se guarda en el dispositivo.
 */
export default function LoginScreen() {
    const router = useRouter();
    const { login, sesionExpirada } = useAuth();
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [verClave, setVerClave] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function entrar() {
        if (enviando) return;
        if (!usuario.trim() || !contrasena) {
            setError('Usuario y contraseña son obligatorios.');
            return;
        }
        setEnviando(true);
        setError(null);
        try {
            await login(usuario, contrasena);
            setContrasena('');
            router.replace('/remoto');
        } catch (e) {
            setError(mensajeDeError(e));
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
                <ReturnButton destinoSiNoHayHistorial="/" />
                <Text style={styles.etiquetaSuperior}>ACCESO SEGURO · JWT</Text>
                <Text style={styles.titulo}>Iniciar sesión</Text>
                <Text style={styles.ayuda}>
                    Los datos persistidos (PostgreSQL) requieren sesión. El laboratorio local no.
                </Text>

                {sesionExpirada && (
                    <Text accessibilityRole="alert" style={styles.aviso}>
                        Tu sesión expiró o el token dejó de ser válido. Vuelve a iniciar sesión.
                    </Text>
                )}

                <Text style={styles.etiqueta}>Usuario</Text>
                <TextInput
                    value={usuario}
                    onChangeText={setUsuario}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="username"
                    placeholder="admin"
                    placeholderTextColor={PALETTE.borde}
                    accessibilityLabel="Usuario"
                    style={styles.input}
                />

                <Text style={styles.etiqueta}>Contraseña</Text>
                <View style={styles.filaClave}>
                    <TextInput
                        value={contrasena}
                        onChangeText={setContrasena}
                        secureTextEntry={!verClave}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="password"
                        placeholder="••••••••"
                        placeholderTextColor={PALETTE.borde}
                        accessibilityLabel="Contraseña"
                        onSubmitEditing={() => void entrar()}
                        style={[styles.input, styles.inputClave]}
                    />
                    <Pressable
                        onPress={() => setVerClave((v) => !v)}
                        accessibilityRole="button"
                        accessibilityLabel={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        style={styles.ver}
                    >
                        <Text style={styles.verTexto}>{verClave ? 'OCULTAR' : 'VER'}</Text>
                    </Pressable>
                </View>

                {error && (
                    <Text accessibilityRole="alert" style={styles.error}>
                        {error}
                    </Text>
                )}

                <Pressable
                    onPress={() => void entrar()}
                    disabled={enviando}
                    accessibilityRole="button"
                    accessibilityLabel="Iniciar sesión"
                    accessibilityState={{ disabled: enviando, busy: enviando }}
                    style={({ pressed }) => [styles.boton, (pressed || enviando) && styles.presionado]}
                >
                    {enviando ? (
                        <ActivityIndicator color={PALETTE.principal} />
                    ) : (
                        <Text style={styles.botonTexto}>Iniciar sesión</Text>
                    )}
                </Pressable>

                <Text style={styles.nota}>
                    Cuenta de aula configurada en el backend. En producción: HTTPS y usuarios reales.
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const ROJO = '#f87171';

const styles = StyleSheet.create({
    pantalla: { flex: 1, backgroundColor: PALETTE.fondo },
    contenido: { padding: 18, paddingBottom: 40 },
    etiquetaSuperior: { fontSize: 12, fontWeight: '800', color: PALETTE.acento, letterSpacing: 1 },
    titulo: { marginTop: 6, fontSize: 26, fontWeight: '800', color: PALETTE.principal },
    ayuda: { marginTop: 10, color: PALETTE.secundario, lineHeight: 21 },
    aviso: {
        marginTop: 16,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.inactivo,
        backgroundColor: PALETTE.inactivoClaro,
        color: PALETTE.inactivo,
        lineHeight: 20,
    },
    etiqueta: {
        marginTop: 20,
        marginBottom: 8,
        color: PALETTE.principal,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#130924', // cyberInput
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: PALETTE.principal,
        fontSize: 15,
    },
    filaClave: { flexDirection: 'row', gap: 8 },
    inputClave: { flex: 1 },
    ver: {
        justifyContent: 'center',
        paddingHorizontal: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        backgroundColor: PALETTE.superficie,
    },
    verTexto: { color: PALETTE.lima, fontWeight: '800', fontSize: 12, letterSpacing: 1 },
    error: { marginTop: 14, color: ROJO, lineHeight: 20 },
    boton: {
        marginTop: 26,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    presionado: { opacity: 0.7 },
    botonTexto: { color: PALETTE.principal, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    nota: { marginTop: 18, textAlign: 'center', color: PALETTE.secundario, fontSize: 12, lineHeight: 18 },
});
