import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { Mantenimiento } from '../models/equiprent';
import { PALETTE } from '../theme/palette';

type Props = {
  mantenimiento: Mantenimiento;
  codigoUnidad: string;
};

export function MantenimientoCard({ mantenimiento, codigoUnidad }: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.fila}>
        <Text style={styles.tipo}>{mantenimiento.tipoMantenimiento}</Text>
        <Text style={styles.fecha}>{mantenimiento.fecha}</Text>
      </View>

      <Text style={styles.descripcion}>{mantenimiento.descripcion}</Text>
      <Text style={styles.costo}>Costo: ${mantenimiento.costo.toFixed(2)}</Text>
      <Text style={styles.unidad}>Unidad: {codigoUnidad}</Text>

      {!mantenimiento.activo && (
        <Text style={styles.inactivo}>REGISTRO INACTIVO</Text>
      )}
    </View>
  );
}

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: PALETTE.superficie,
    borderColor: PALETTE.borde,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  fila: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  tipo: { color: PALETTE.acento, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  fecha: { fontFamily: MONO, color: PALETTE.secundario, fontSize: 12 },
  descripcion: { color: PALETTE.principal, fontSize: 16, fontWeight: '800', marginTop: 6 },
  costo: { color: PALETTE.lima, fontSize: 14, fontWeight: '700', marginTop: 6 },
  unidad: { fontFamily: MONO, color: PALETTE.secundario, fontSize: 12, marginTop: 6 },
  inactivo: {
    alignSelf: 'flex-start',
    marginTop: 10,
    fontSize: 11,
    fontWeight: '800',
    color: PALETTE.inactivo,
    backgroundColor: PALETTE.inactivoClaro,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    overflow: 'hidden',
  },
});