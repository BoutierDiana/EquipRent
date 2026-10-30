import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '../theme/palette';

type Props = { mensaje: string };

export function EmptyState({ mensaje }: Props) {
  return (
    <View style={styles.caja} accessibilityRole="text">
      <View style={styles.encabezado}>
        {/* Indicador geométrico: cuadro con núcleo (sin emojis) */}
        <View style={styles.icono}>
          <View style={styles.nucleo} />
        </View>
        <Text style={styles.titulo}>Sin resultados</Text>
      </View>
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: PALETTE.acentoClaro,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: PALETTE.acento,
  },
  encabezado: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icono: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: PALETTE.lima,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nucleo: { width: 6, height: 6, backgroundColor: PALETTE.acento },
  titulo: {
    fontWeight: '800',
    color: PALETTE.principal,
    fontSize: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  texto: { marginTop: 8, lineHeight: 20, color: PALETTE.secundario },
});