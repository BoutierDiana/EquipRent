import React from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { ReturnButton } from '../components/ReturnButton';
import { PALETTE } from '../theme/palette';

/** Ruta "/ayuda" : objetivos de la práctica y pruebas de errores controlados. */
export default function AyudaScreen() {
    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/" />
            <Text style={styles.titulo}>Laboratorio Guía 03: EquipRent</Text>
            <Text style={styles.parrafo}>
                Cada pantalla mapea una ruta independiente en el Stack de Expo Router. Los componentes
                se comunican únicamente mediante parámetros tipados (IDs) y consultan las fuentes de
                datos en destino.
            </Text>
            <Text style={styles.parrafo}>
                No transferimos objetos completos entre pantallas para evitar inconsistencias de memoria.
            </Text>

            <Text style={styles.subtitulo}>Prueba 1: Unidad inexistente</Text>
            <Text style={styles.parrafo}>
                Abre una ruta válida (/unidades/[id]) pero con un ID numérico que no existe. Debe
                renderizar EmptyState sin provocar una excepción.
            </Text>
            <Link href={{ pathname: '/unidades/[id]', params: { id: '999' } }} asChild>
                <Pressable style={styles.accion} accessibilityRole="link">
                    <Text style={styles.accionTexto}>Probar Unidad 999 (Inexistente)</Text>
                </Pressable>
            </Link>

            <Text style={styles.subtitulo}>Prueba 2: Parámetro mal formado</Text>
            <Text style={styles.parrafo}>
                Envía un valor alfabético como ID. La función leerIdPositivo lo rechazará antes de
                intentar una búsqueda.
            </Text>
            <Link href={{ pathname: '/mantenimientos/[id]', params: { id: 'abc' } }} asChild>
                <Pressable style={styles.accion} accessibilityRole="link">
                    <Text style={styles.accionTexto}>Probar Mantenimiento ID "abc" (Inválido)</Text>
                </Pressable>
            </Link>

            <Text style={styles.nota}>
                Estos disparadores son pedagógicos y permiten validar la tolerancia a fallos del enrutador.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 40 },
    titulo: { marginTop: 4, fontSize: 23, fontWeight: '800', color: PALETTE.principal },
    subtitulo: { marginTop: 25, fontSize: 18, fontWeight: '800', color: PALETTE.principal },
    parrafo: { marginTop: 12, lineHeight: 23, color: PALETTE.secundario },
    accion: {
        backgroundColor: PALETTE.acentoClaro,
        borderWidth: 1,
        borderColor: PALETTE.acento,
        borderRadius: 12,
        padding: 17,
        marginTop: 12,
    },
    accionTexto: { textAlign: 'center', fontWeight: '700', color: PALETTE.principal },
    nota: { marginTop: 20, lineHeight: 21, color: PALETTE.acento, fontSize: 13 },
});