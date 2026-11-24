import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { nombreEquipo } from '../data/catalogoEquipos';
import type { UnidadEquipoDto } from '../infra/http/unidadesApi';
import { PALETTE } from '../theme/palette';
import { formatearCatalogo } from '../utils/formato';

type Props = { unidad: UnidadEquipoDto; alSeleccionar: () => void };

/** Tarjeta de una UnidadEquipo PERSISTIDA: muestra solo campos reales del backend. */
export function UnidadRemotaCard({ unidad, alSeleccionar }: Props) {
    return (
        <Pressable
            onPress={alSeleccionar}
            accessibilityRole="button"
            accessibilityLabel={`Ver unidad remota ${unidad.numeroSerie}`}
            style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
        >
            <View style={styles.fila}>
                <Text style={styles.serie}>{unidad.numeroSerie}</Text>
                <Text style={[styles.estado, !unidad.activo && styles.inactiva]}>
                    {unidad.activo ? 'ACTIVA' : 'INACTIVA'}
                </Text>
            </View>
            <Text style={styles.nombre}>{nombreEquipo(unidad.equipoId)}</Text>
            <Text style={styles.detalle}>Estado operativo: {formatearCatalogo(unidad.estadoOperativo)}</Text>
            <Text style={styles.detalle}>Uso acumulado: {unidad.metricaUsoAcumulada} h · ID BD {unidad.id}</Text>
        </Pressable>
    );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
    tarjeta: {
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderLeftWidth: 3,
        borderLeftColor: PALETTE.acento,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    presionada: { opacity: 0.85 },
    fila: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    serie: { fontFamily: MONO, fontSize: 13, fontWeight: '700', color: PALETTE.lima },
    estado: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        color: PALETTE.principal,
        backgroundColor: PALETTE.acento,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        overflow: 'hidden',
    },
    inactiva: { color: PALETTE.inactivo, backgroundColor: PALETTE.inactivoClaro },
    nombre: { marginTop: 8, fontSize: 17, fontWeight: '800', color: PALETTE.principal },
    detalle: { marginTop: 4, color: PALETTE.secundario, fontSize: 13 },
});
