import React, { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../../components/EmptyState';
import { ReturnButton } from '../../../components/ReturnButton';
import { nombreEquipo } from '../../../data/catalogoEquipos';
import { mensajeDeError } from '../../../infra/http/apiClient';
import type { UnidadEquipoDto } from '../../../infra/http/unidadesApi';
import {
    descargarUnidades,
    listarCache,
    listarPendientes,
    sincronizarPendientes,
    ultimaDescarga,
    type Pendiente,
} from '../../../offline/cache';
import { PALETTE } from '../../../theme/palette';

/**
 * Ruta /remoto/offline (Guía 12): caché SQLite + cola manual de cambios.
 * - "Descargar" necesita red: copia las unidades de PostgreSQL al teléfono.
 * - La lista y la edición funcionan SIN red (leen/escriben SQLite).
 * - "Sincronizar" es MANUAL a propósito: el usuario decide cuándo enviar,
 *   y los conflictos nunca se sobrescriben en silencio.
 */
export default function OfflineScreen() {
    const router = useRouter();
    const [unidades, setUnidades] = useState<UnidadEquipoDto[]>([]);
    const [pendientes, setPendientes] = useState<Pendiente[]>([]);
    const [descarga, setDescarga] = useState<string | null>(null);
    const [trabajando, setTrabajando] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);

    const cargar = useCallback(async () => {
        try {
            const [u, p, d] = await Promise.all([listarCache(), listarPendientes(), ultimaDescarga()]);
            setUnidades(u);
            setPendientes(p);
            setDescarga(d);
        } catch (e) {
            setMensaje(`SQLite: ${e instanceof Error ? e.message : 'error'}`);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void cargar();
        }, [cargar])
    );

    async function ejecutar(accion: 'descargar' | 'sincronizar') {
        if (trabajando) return;
        setTrabajando(true);
        setMensaje(null);
        try {
            if (accion === 'descargar') {
                const n = await descargarUnidades();
                setMensaje(`${n} unidades descargadas. Ya puedes consultarlas sin conexión.`);
            } else {
                const r = await sincronizarPendientes();
                const partes = [`${r.correctos} cambio(s) aplicados.`];
                if (r.conflictos.length) partes.push(`Conflictos: ${r.conflictos.join('; ')}.`);
                if (r.errores.length) partes.push(`Sin enviar (se reintentará): ${r.errores.join('; ')}.`);
                setMensaje(partes.join(' '));
            }
            await cargar();
        } catch (e) {
            setMensaje(`Sin conexión con el servidor: ${mensajeDeError(e)}. El caché anterior sigue intacto.`);
        } finally {
            setTrabajando(false);
        }
    }

    const pendientePor = new Map(pendientes.map((p) => [p.unidadId, p]));
    const conflictos = pendientes.filter((p) => p.conflicto).length;

    return (
        <FlatList
            data={unidades}
            keyExtractor={(u) => String(u.id)}
            contentContainerStyle={styles.contenido}
            ListHeaderComponent={
                <View>
                    <ReturnButton destinoSiNoHayHistorial="/remoto" />
                    <Text style={styles.etiquetaSuperior}>GUÍA 12 · SQLITE</Text>
                    <Text style={styles.titulo}>Modo sin conexión</Text>
                    <Text style={styles.ayuda}>
                        Descarga con red, consulta y edita sin red, y sincroniza cuando vuelvas a tener
                        conexión. La sincronización es manual para evitar sobrescrituras.
                    </Text>

                    <View style={styles.metricas}>
                        <Metrica valor={unidades.length} texto="En caché" />
                        <Metrica valor={pendientes.length} texto="Pendientes" />
                        <Metrica valor={conflictos} texto="Conflictos" alerta={conflictos > 0} />
                    </View>
                    <Text style={styles.fecha}>
                        Última descarga: {descarga ? new Date(descarga).toLocaleString() : 'nunca'}
                    </Text>

                    <Boton
                        texto="Descargar unidades desde REST"
                        onPress={() => void ejecutar('descargar')}
                        deshabilitado={trabajando}
                    />
                    <Boton
                        texto={`Sincronizar ${pendientes.length} cambio(s) pendiente(s)`}
                        onPress={() => void ejecutar('sincronizar')}
                        deshabilitado={trabajando || pendientes.length === 0}
                        secundario
                    />
                    {trabajando && <ActivityIndicator style={styles.spinner} color={PALETTE.lima} />}
                    {mensaje && (
                        <Text accessibilityRole="alert" style={styles.mensaje}>
                            {mensaje}
                        </Text>
                    )}
                </View>
            }
            renderItem={({ item }) => {
                const p = pendientePor.get(item.id);
                return (
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Editar sin conexión ${item.numeroSerie}`}
                        onPress={() =>
                            router.push({ pathname: '/remoto/offline/[id]', params: { id: String(item.id) } })
                        }
                        style={({ pressed }) => [styles.tarjeta, pressed && styles.presionado]}
                    >
                        <View style={styles.fila}>
                            <Text style={styles.serie}>{item.numeroSerie}</Text>
                            {p && (
                                <Text style={[styles.chip, p.conflicto ? styles.chipConflicto : styles.chipPendiente]}>
                                    {p.conflicto ? 'CONFLICTO' : 'PENDIENTE'}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.detalle}>
                            {nombreEquipo(item.equipoId)} · {(p?.cambios.estadoOperativo ?? item.estadoOperativo).replace(/_/g, ' ')}
                        </Text>
                        {p?.conflicto && <Text style={styles.conflicto}>{p.conflicto}</Text>}
                    </Pressable>
                );
            }}
            ListEmptyComponent={
                <EmptyState mensaje="El caché está vacío. Con conexión, pulsa «Descargar unidades desde REST»." />
            }
        />
    );
}

function Metrica({ valor, texto, alerta }: { valor: number; texto: string; alerta?: boolean }) {
    return (
        <View style={styles.metrica}>
            <Text style={[styles.metricaValor, alerta && { color: PALETTE.inactivo }]}>{valor}</Text>
            <Text style={styles.metricaTexto}>{texto}</Text>
        </View>
    );
}

function Boton(props: { texto: string; onPress: () => void; deshabilitado: boolean; secundario?: boolean }) {
    return (
        <Pressable
            onPress={props.onPress}
            disabled={props.deshabilitado}
            accessibilityRole="button"
            accessibilityState={{ disabled: props.deshabilitado }}
            style={({ pressed }) => [
                styles.boton,
                props.secundario && styles.botonSecundario,
                (pressed || props.deshabilitado) && styles.presionado,
            ]}
        >
            <Text style={styles.botonTexto}>{props.texto}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 45 },
    etiquetaSuperior: { fontSize: 12, fontWeight: '800', color: PALETTE.acento, letterSpacing: 1 },
    titulo: { marginTop: 6, fontSize: 24, fontWeight: '800', color: PALETTE.principal },
    ayuda: { marginTop: 10, color: PALETTE.secundario, lineHeight: 21 },
    metricas: { flexDirection: 'row', gap: 10, marginTop: 18 },
    metrica: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        backgroundColor: PALETTE.superficie,
    },
    metricaValor: { color: PALETTE.lima, fontSize: 22, fontWeight: '800' },
    metricaTexto: { color: PALETTE.secundario, fontSize: 12, marginTop: 2 },
    fecha: { marginTop: 10, color: PALETTE.secundario, fontSize: 12 },
    boton: {
        marginTop: 12,
        minHeight: 48,
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: PALETTE.acento,
        paddingHorizontal: 14,
    },
    botonSecundario: { backgroundColor: PALETTE.acentoClaro, borderWidth: 1, borderColor: PALETTE.acento },
    botonTexto: { color: PALETTE.principal, fontWeight: '800', textAlign: 'center' },
    presionado: { opacity: 0.6 },
    spinner: { marginTop: 12 },
    mensaje: { marginTop: 12, color: PALETTE.principal, lineHeight: 20 },
    tarjeta: {
        marginTop: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        backgroundColor: PALETTE.superficie,
    },
    fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    serie: { color: PALETTE.lima, fontWeight: '800', fontSize: 15 },
    chip: { fontSize: 11, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: 'hidden' },
    chipPendiente: { color: PALETTE.fondo, backgroundColor: PALETTE.secundario },
    chipConflicto: { color: PALETTE.fondo, backgroundColor: PALETTE.inactivo },
    detalle: { marginTop: 6, color: PALETTE.principal },
    conflicto: { marginTop: 6, color: PALETTE.inactivo, lineHeight: 19 },
});
