import React from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MetricCard } from '../components/MetricCard';
import { MANTENIMIENTOS, UNIDADES } from '../data/demoData';
import { PALETTE } from '../theme/palette';

/** Ruta / : menú principal de EquipRent Mobile. */
export default function InicioScreen() {
    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <View style={styles.nodo}>
                <View style={styles.nodoPunto} />
                <Text style={styles.nodoTexto}>ONLINE NODE · EQUIPRENT</Text>
            </View>
            <Text style={styles.etiqueta}>PROGRAMACIÓN APLICADA · 2026-II</Text>
            <Text style={styles.titulo}>Alquiler de Equipamiento Móvil</Text>
            <Text style={styles.descripcion}>
                Gestión técnica y trazabilidad de maquinaria con Expo Router y TypeScript.
            </Text>

            {/* Métricas: el mismo componente reutilizado con props distintas */}
            <View style={styles.metricas}>
                <MetricCard etiqueta="Unidades" valor={UNIDADES.length} />
                <MetricCard etiqueta="Mantenimientos" valor={MANTENIMIENTOS.length} />
            </View>

            <Text style={styles.subtitulo}>Módulos disponibles</Text>

            {/* Link + asChild: toda la tarjeta Pressable se vuelve el enlace */}
            <Link href="/unidades" asChild>
                <Pressable style={styles.boton} accessibilityRole="link">
                    <View style={styles.botonFila}>
                        <Text style={styles.botonTitulo}>Catálogo de Unidades</Text>
                        <View style={styles.flecha} />
                    </View>
                    <Text style={styles.botonSub}>Ver equipos y su historial técnico</Text>
                </Pressable>
            </Link>

            <Link href="/mantenimientos" asChild>
                <Pressable style={styles.boton} accessibilityRole="link">
                    <View style={styles.botonFila}>
                        <Text style={styles.botonTitulo}>Órdenes de Taller</Text>
                        <View style={styles.flecha} />
                    </View>
                    <Text style={styles.botonSub}>Historia global de servicios y costos</Text>
                </Pressable>
            </Link>

            <Link href="/ayuda" asChild>
                <Pressable style={styles.botonSuave} accessibilityRole="link">
                    <Text style={styles.botonTitulo}>Laboratorio y Casos Límite</Text>
                </Pressable>
            </Link>

            <Text style={styles.aviso}>
                El catálogo de unidades consulta la API REST de Spring Boot; las métricas de inicio
                usan los datos locales de demostración.
            </Text>
            <Text style={styles.pie}>UnidadEquipo (1) → Mantenimiento (N)</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contenido: { paddingHorizontal: 18, paddingTop: 24, paddingBottom: 42 },
    nodo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 14,
    },
    nodoPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: PALETTE.lima },
    nodoTexto: { color: PALETTE.secundario, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    etiqueta: { fontSize: 12, fontWeight: '800', color: PALETTE.acento, letterSpacing: 1 },
    titulo: { marginTop: 8, fontSize: 28, fontWeight: '800', color: PALETTE.principal },
    descripcion: { marginTop: 10, lineHeight: 22, color: PALETTE.secundario },
    metricas: { flexDirection: 'row', gap: 12, marginTop: 20 },
    subtitulo: {
        marginTop: 26,
        marginBottom: 12,
        color: PALETTE.principal,
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
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
    aviso: { marginTop: 24, lineHeight: 20, color: PALETTE.acento, fontSize: 13 },
    pie: { marginTop: 10, textAlign: 'center', color: PALETTE.lima, fontWeight: '700', fontSize: 12 },
});