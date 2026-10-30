import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Seccion } from '../models/equiprent';
import { PALETTE } from '../theme/palette';

type Props = {
  actual: Seccion;
  alCambiar: (nuevaSeccion: Seccion) => void;
};

const OPCIONES: { clave: Seccion; etiqueta: string }[] = [
  { clave: 'unidades', etiqueta: 'Unidades' },
  { clave: 'mantenimientos', etiqueta: 'Mantenimientos' },
];

export function TabSelector({ actual, alCambiar }: Props) {
  return (
    <View style={styles.fila}>
      {OPCIONES.map((opcion) => {
        const elegida = actual === opcion.clave;
        return (
          <Pressable
            key={opcion.clave}
            onPress={() => alCambiar(opcion.clave)}
            accessibilityRole="button"
            accessibilityLabel={`Mostrar ${opcion.etiqueta}`}
            accessibilityState={{ selected: elegida }}
            style={[styles.boton, elegida && styles.botonElegido]}
          >
            <Text style={[styles.texto, elegida && styles.textoElegido]}>
              {opcion.etiqueta}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: { flexDirection: 'row', gap: 12, marginTop: 12 },
  boton: {
    flex: 1,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PALETTE.acentoClaro,
    borderWidth: 1,
    borderColor: PALETTE.borde,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  botonElegido: {
    backgroundColor: PALETTE.acento,
    borderColor: PALETTE.lima, // borde activo Cyber-Industrial
  },
  texto: {
    color: PALETTE.secundario,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textoElegido: { color: PALETTE.principal },
});