import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { UnidadEquipo } from '../models/equiprent';
import { PALETTE } from '../theme/palette';

type Props = {
  unidad: UnidadEquipo;
  cantidadMantenimientos: number;
  seleccionada: boolean;
  alSeleccionar: () => void;
};

export function UnidadEquipoCard({
  unidad,
  cantidadMantenimientos,
  seleccionada,
  alSeleccionar,
}: Props) {
  return (
    <Pressable
      onPress={alSeleccionar}
      accessibilityRole="button"
      accessibilityLabel={`Ver mantenimientos de ${unidad.codigoInventario}`}
      accessibilityState={{ selected: seleccionada }}
      style={[styles.tarjeta, seleccionada && styles.tarjetaSeleccionada]}
    >
      <View style={styles.fila}>
        <Text style={styles.codigo}>{unidad.codigoInventario}</Text>
        <Text style={[styles.estado, !unidad.activo && styles.inactiva]}>
          {unidad.activo ? 'ACTIVA' : 'INACTIVA'}
        </Text>
      </View>

      <Text style={styles.nombre}>
        {unidad.marca} {unidad.modelo}
      </Text>
      <Text style={styles.detalle}>Serie: {unidad.numeroSerie}</Text>
      <Text style={styles.detalle}>Estado operativo: {unidad.estadoOperativo}</Text>
      <Text style={styles.detalle}>
        {cantidadMantenimientos} mantenimiento(s) en la demostración
      </Text>

      <Text style={[styles.accion, seleccionada && styles.accionActiva]}>
        {seleccionada ? 'Unidad seleccionada' : 'Tocar para ver mantenimientos'}
      </Text>
    </Pressable>
  );
}

// Fuente monoespaciada para códigos (equivale a 'JetBrains Mono' en la web).
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: PALETTE.superficie,
    borderWidth: 1,
    borderColor: PALETTE.borde,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  tarjetaSeleccionada: { borderColor: PALETTE.lima, borderWidth: 2 },
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  codigo: { fontFamily: MONO, fontSize: 13, fontWeight: '700', color: PALETTE.lima },
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
  accion: { marginTop: 12, color: PALETTE.acento, fontWeight: '700' },
  accionActiva: { color: PALETTE.lima },
});