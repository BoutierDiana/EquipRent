import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

type Seccion = 'unidades' | 'mantenimientos';

export default function App() {
  const [seccion, setSeccion] = useState<Seccion>('unidades');
  const esUnidades = seccion === 'unidades';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.pantalla} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.contenido}>
          <Text style={styles.etiqueta}>PROGRAMACION APLICADA</Text>
          <Text style={styles.titulo}>EquipRent</Text>
          <Text style={styles.subtitulo}>
            Mi primera aplicacion Android con React Native.
          </Text>

          <View style={styles.filaIndicadores}>
            <View style={styles.indicador}>
              <Text style={styles.numero}>0</Text>
              <Text style={styles.indicadorTexto}>Unidades de Equipo</Text>
            </View>
            <View style={styles.indicador}>
              <Text style={styles.numero}>0</Text>
              <Text style={styles.indicadorTexto}>Mantenimientos</Text>
            </View>
          </View>

          <Text style={styles.seccionTitulo}>Explorar modulos</Text>
          <View style={styles.filaBotones}>
            <Pressable
              onPress={() => setSeccion('unidades')}
              accessibilityRole="button"
              accessibilityLabel="Mostrar modulo Unidades de Equipo"
              accessibilityState={{ selected: esUnidades }}
              style={[styles.boton, esUnidades && styles.botonActivo]}
            >
              <Text
                style={[
                  styles.botonTexto,
                  esUnidades && styles.botonTextoActivo,
                ]}
              >
                Unidades de Equipo
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSeccion('mantenimientos')}
              accessibilityRole="button"
              accessibilityLabel="Mostrar modulo Mantenimientos"
              accessibilityState={{ selected: !esUnidades }}
              style={[styles.boton, !esUnidades && styles.botonActivo]}
            >
              <Text
                style={[
                  styles.botonTexto,
                  !esUnidades && styles.botonTextoActivo,
                ]}
              >
                Mantenimientos
              </Text>
            </Pressable>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitulo}>
              {esUnidades ? 'Modulo Unidades de Equipo' : 'Modulo Mantenimientos'}
            </Text>
            <Text style={styles.panelTexto}>
              {esUnidades
                ? 'Aqui mostraremos las unidades de equipo y sus datos.'
                : 'Aqui mostraremos las ordenes de mantenimiento de una unidad de equipo.'}
            </Text>
            <Text style={styles.aviso}>
              Datos reales: ninguno. Sin API ni base de datos aun.
            </Text>
          </View>
          <Text style={styles.pie}>UnidadEquipo (1) - Mantenimiento (N)</Text>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: '#0b0614' },
  contenido: { padding: 20, paddingBottom: 42 },
  etiqueta: { fontSize: 12, color: '#ccff00', fontWeight: '700', letterSpacing: 2 },
  titulo: { fontSize: 31, color: '#f5f3ff', fontWeight: '800', marginTop: 8 },
  subtitulo: { fontSize: 15, color: '#a89cc8', marginTop: 9 },
  filaIndicadores: { flexDirection: 'row', gap: 12, marginTop: 24 },
  indicador: {
    flex: 1, padding: 18, borderRadius: 16, backgroundColor: '#140b24',
    borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.25)',
  },
  numero: { fontSize: 29, fontWeight: '700', color: '#ccff00' },
  indicadorTexto: { marginTop: 4, color: '#a89cc8' },
  seccionTitulo: { fontSize: 18, fontWeight: '700', marginTop: 26,
    marginBottom: 13, color: '#d8b4fe' },
  filaBotones: { flexDirection: 'row', gap: 10 },
  boton: { flex: 1, borderRadius: 12, padding: 14,
    backgroundColor: '#130924', alignItems: 'center',
    borderWidth: 1, borderColor: '#581c87' },
  botonActivo: { backgroundColor: '#9333ea', borderColor: '#ccff00' },
  botonTexto: { color: '#d8b4fe', fontWeight: '700', textAlign: 'center' },
  botonTextoActivo: { color: '#ffffff' },
  panel: { marginTop: 17, backgroundColor: '#140b24', padding: 21,
    borderRadius: 17, borderLeftWidth: 3, borderLeftColor: '#ccff00' },
  panelTitulo: { fontSize: 20, color: '#f5f3ff', fontWeight: '700' },
  panelTexto: { fontSize: 15, color: '#a89cc8', marginTop: 13,
    lineHeight: 23 },
  aviso: { fontSize: 13, color: '#c084fc', marginTop: 21 },
  pie: { textAlign: 'center', color: '#a855f7', marginTop: 30, letterSpacing: 1 },
});