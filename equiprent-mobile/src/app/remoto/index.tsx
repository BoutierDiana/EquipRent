import React from 'react';
import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ReturnButton } from '../../components/ReturnButton';
import { API_BASE_URL } from '../../infra/http/apiClient';
import { useAuth } from '../../state/AuthContext';
import { PALETTE } from '../../theme/palette';

/**
 * Ruta /remoto (Guía 09): punto de entrada a los datos PERSISTIDOS.
 * Todo lo que cuelga de /remoto consulta Spring Boot + PostgreSQL;
 * /unidades y /mantenimientos siguen siendo el laboratorio LOCAL (Guías 05–07).
 */
export default function AreaRemotaScreen() {
    const router = useRouter();
    const { usuario, logout } = useAuth();

    async function cerrarSesion() {
        await logout(); // borra el token de SecureStore
        router.replace('/');
    }

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/" />
            <Text style={styles.etiqueta}>SPRING BOOT · POSTGRESQL</Text>
            <Text style={styles.titulo}>Datos PERSISTIDOS (API)</Text>
            <Text style={styles.ayuda}>
                Estas pantallas leen y escriben en la base de datos real. Son distintas del
                laboratorio local: aquí los cambios sobreviven al recargar la app.
            </Text>
            <Text style={styles.url}>{API_BASE_URL}</Text>

            <View style={styles.sesion}>
                <View style={styles.punto} />
                <Text style={styles.sesionTexto}>Sesión: {usuario ?? 'usuario'} · JWT en SecureStore</Text>
                <Pressable
                    onPress={() => void cerrarSesion()}
                    accessibilityRole="button"
                    accessibilityLabel="Cerrar sesión"
                    style={styles.salir}
                >
                    <Text style={styles.salirTexto}>SALIR</Text>
                </Pressable>
            </View>

            <Link href="/remoto/unidades" asChild>
                <Pressable style={styles.boton} accessibilityRole="link">
                    <View style={styles.botonFila}>
                        <Text style={styles.botonTitulo}>CRUD REST de Unidades</Text>
                        <View style={styles.flecha} />
                    </View>
                    <Text style={styles.botonSub}>/api/unidades-equipo · GET POST PUT DELETE</Text>
                </Pressable>
            </Link>

            <Link href="/remoto/mantenimientos" asChild>
                <Pressable style={styles.boton} accessibilityRole="link">
                    <View style={styles.botonFila}>
                        <Text style={styles.botonTitulo}>CRUD REST de Mantenimientos</Text>
                        <View style={styles.flecha} />
                    </View>
                    <Text style={styles.botonSub}>/api/mantenimientos · relación 1:N con unidades</Text>
                </Pressable>
            </Link>

            <Link href="/remoto/offline" asChild>
                <Pressable style={styles.boton} accessibilityRole="link">
                    <View style={styles.botonFila}>
                        <Text style={styles.botonTitulo}>SQLite y modo sin conexión</Text>
                        <View style={styles.flecha} />
                    </View>
                    <Text style={styles.botonSub}>Caché local · cola de cambios · sincronización manual</Text>
                </Pressable>
            </Link>

            <Link href="/remoto/fotos" asChild>
                <Pressable style={styles.boton} accessibilityRole="link">
                    <View style={styles.botonFila}>
                        <Text style={styles.botonTitulo}>Fotos de evidencia</Text>
                        <View style={styles.flecha} />
                    </View>
                    <Text style={styles.botonSub}>Cámara · galería · subida multipart a Spring Boot</Text>
                </Pressable>
            </Link>

            <Link href="/diagnostico" asChild>
                <Pressable style={styles.botonSuave} accessibilityRole="link">
                    <Text style={styles.botonTitulo}>Diagnóstico de conexión</Text>
                </Pressable>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 40 },
    etiqueta: { fontSize: 12, fontWeight: '800', color: PALETTE.acento, letterSpacing: 1 },
    titulo: { marginTop: 6, fontSize: 24, fontWeight: '800', color: PALETTE.principal },
    ayuda: { marginTop: 10, color: PALETTE.secundario, lineHeight: 21 },
    url: { marginTop: 8, marginBottom: 12, color: PALETTE.lima, fontSize: 12 },
    sesion: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 10,
        padding: 10,
        marginBottom: 18,
    },
    punto: { width: 8, height: 8, borderRadius: 4, backgroundColor: PALETTE.lima },
    sesionTexto: { flex: 1, color: PALETTE.secundario, fontSize: 12 },
    salir: { borderWidth: 1, borderColor: '#f87171', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
    salirTexto: { color: '#f87171', fontWeight: '800', fontSize: 11, letterSpacing: 1 },
    boton: {
        backgroundColor: PALETTE.superficie,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        marginBottom: 11,
    },
    botonFila: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    botonTitulo: { color: PALETTE.principal, fontSize: 16, fontWeight: '800' },
    botonSub: { color: PALETTE.secundario, marginTop: 6, lineHeight: 20 },
    flecha: {
        width: 9,
        height: 9,
        borderRightWidth: 2,
        borderTopWidth: 2,
        borderColor: PALETTE.lima,
        transform: [{ rotate: '45deg' }],
    },
    botonSuave: {
        backgroundColor: PALETTE.acentoClaro,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: PALETTE.acento,
    },
});
