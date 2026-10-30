import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '../theme/palette';

type Props = {
  etiqueta: string;
  valor: number;
};

export function MetricCard({ etiqueta, valor }: Props) {
  return (
    <View style={styles.tarjeta}>
      <Text style={styles.valor}>{valor}</Text>
      <Text style={styles.etiqueta}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    minWidth: 120,
    backgroundColor: PALETTE.superficie,
    borderColor: PALETTE.borde,
    borderWidth: 1,
    borderLeftWidth: 3,
    borderLeftColor: PALETTE.lima, // acento tecnológico Cyber-Industrial
    borderRadius: 12,
    padding: 16,
  },
  valor: {
    fontSize: 28,
    fontWeight: '800',
    color: PALETTE.lima, // métricas clave en lima
  },
  etiqueta: {
    color: PALETTE.secundario,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});