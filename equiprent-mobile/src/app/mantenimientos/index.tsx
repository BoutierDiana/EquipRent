import React from 'react';
import { Link } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MantenimientoNavegable } from '../../components/MantenimientoNavegable';
import { ReturnButton } from '../../components/ReturnButton';
import { MANTENIMIENTOS, UNIDADES } from '../../data/demoData';
import { PALETTE } from '../../theme/palette';

/** Ruta /mantenimientos : historial global de órdenes de taller. */
export default function MantenimientosScreen() {
    return (
        <FlatList
            data={MANTENIMIENTOS}
            keyExtractor={(mantenimiento) => String(mantenimiento.id)}
            contentContainerStyle={styles.contenido}
            ListHeaderComponent={
                <View style={styles.encabezado}>
                    <ReturnButton destinoSiNoHayHistorial="/" />
                    <Text style={styles.titulo}>Órdenes de Mantenimiento</Text>
                    <Text style={styles.ayuda}>
                        Guía 04: primero validaremos el formulario, después guardaremos.
                    </Text>
                    <Link href="/mantenimientos/nuevo" asChild>
                        <Pressable
                            style={styles.nuevo}
                            accessibilityRole="link"
                            accessibilityLabel="Abrir formulario de nueva orden"
                        >
                            <Text style={styles.nuevoTexto}>+ Formulario nueva orden</Text>
                        </Pressable>
                    </Link>
                </View>
            }
            renderItem={({ item }) => {
                // Se resuelve la unidad por la clave foránea unidadEquipoId.
                const unidad = UNIDADES.find((u) => u.id === item.unidadEquipoId);
                return (
                    <MantenimientoNavegable
                        mantenimiento={item}
                        codigoUnidad={unidad?.codigoInventario ?? 'Unidad no encontrada'}
                    />
                );
            }}
            ListFooterComponent={
                <Text style={styles.pie}>Datos de simulación técnica · EquipRent</Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 36 },
    encabezado: { marginBottom: 14 },
    titulo: { fontSize: 23, fontWeight: '800', color: PALETTE.principal },
    ayuda: { marginTop: 8, color: PALETTE.secundario, lineHeight: 21 },
    nuevo: {
        marginTop: 16,
        minHeight: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    nuevoTexto: { color: PALETTE.principal, fontWeight: '800', letterSpacing: 1 },
    pie: { color: PALETTE.acento, textAlign: 'center', marginTop: 10, fontSize: 12 },
});