import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { MantenimientoDto } from '../infra/http/mantenimientosApi';
import { PALETTE } from '../theme/palette';
import { formatearCatalogo, formatearFecha } from '../utils/formato';

type Props = {
    mantenimiento: MantenimientoDto;
    /** Texto del lado 1 (número de serie de la unidad), resuelto por la pantalla. */
    serieUnidad: string;
    alSeleccionar: () => void;
};

const COLOR_ESTADO: Record<string, string> = {
    EN_PROCESO: PALETTE.lima,
    COMPLETADO: PALETTE.secundario,
    CANCELADO: PALETTE.inactivo,
};

/** Tarjeta de una orden PERSISTIDA (lado N). */
export function MantenimientoRemotoCard({ mantenimiento, serieUnidad, alSeleccionar }: Props) {
    const color = COLOR_ESTADO[mantenimiento.estado] ?? PALETTE.principal;
    return (
        <Pressable
            onPress={alSeleccionar}
            accessibilityRole="button"
            accessibilityLabel={`Ver orden remota ${mantenimiento.id}`}
            style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
        >
            <View style={styles.fila}>
                <Text style={styles.id}>ORDEN #{mantenimiento.id}</Text>
                <Text style={[styles.estado, { color, borderColor: color }]}>
                    {formatearCatalogo(mantenimiento.estado)}
                </Text>
            </View>
            <Text style={styles.tipo}>{mantenimiento.tipo}</Text>
            <Text style={styles.detalle}>Unidad: {serieUnidad}</Text>
            <Text style={styles.detalle}>
                Ingreso {formatearFecha(mantenimiento.fechaIngreso)} · Egreso est.{' '}
                {formatearFecha(mantenimiento.fechaEgresoEstimada)}
            </Text>
        </Pressable>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
    tarjeta: {
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
    },
    presionada: { opacity: 0.85 },
    fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
    id: { fontFamily: MONO, color: PALETTE.acento, fontWeight: '800', fontSize: 12 },
    estado: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        borderWidth: 1,
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 3,
    },
    tipo: { marginTop: 6, fontSize: 16, fontWeight: '800', color: PALETTE.principal },
    detalle: { marginTop: 4, color: PALETTE.secundario, fontSize: 13 },
});
