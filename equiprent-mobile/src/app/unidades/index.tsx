import React from 'react';
import { Link, useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../components/EmptyState';
import { ReturnButton } from '../../components/ReturnButton';
import { UnidadEquipoCard } from '../../components/UnidadEquipoCard';
import { mantenimientosDe } from '../../domain/equiprentRules';
import { useEquipRent } from '../../state/EquipRentContext';
import { PALETTE } from '../../theme/palette';

/**
 * Ruta /unidades : catálogo LOCAL (Guía 05).
 * Lee las unidades del estado compartido (EquipRentContext), así una unidad
 * creada o editada en otra pantalla aparece aquí sin recargar nada.
 * El catálogo conectado a Spring Boot está en /remoto/unidades.
 */
export default function UnidadesScreen() {
    const router = useRouter();
    const { unidades, mantenimientos } = useEquipRent();

    return (
        <FlatList
            data={unidades}
            keyExtractor={(unidad) => String(unidad.id)}
            contentContainerStyle={styles.contenido}
            ListHeaderComponent={
                <View style={styles.encabezado}>
                    <ReturnButton destinoSiNoHayHistorial="/" />
                    <Text style={styles.titulo}>Unidades LOCALES</Text>
                    <Text style={styles.ayuda}>
                        Se conservan hasta que cierres o recargues la aplicación.
                    </Text>
                    <Link href="/unidades/nuevo" asChild>
                        <Pressable
                            style={({ pressed }) => [styles.nuevo, pressed && styles.presionado]}
                            accessibilityRole="link"
                            accessibilityLabel="Registrar nueva unidad"
                        >
                            <Text style={styles.nuevoTexto}>+ Registrar unidad</Text>
                        </Pressable>
                    </Link>
                </View>
            }
            renderItem={({ item }) => (
                <UnidadEquipoCard
                    unidad={item}
                    cantidadMantenimientos={mantenimientosDe(item.id, mantenimientos).length}
                    seleccionada={false}
                    alSeleccionar={() =>
                        router.push({ pathname: '/unidades/[id]', params: { id: String(item.id) } })
                    }
                />
            )}
            ListEmptyComponent={<EmptyState mensaje="No hay unidades. Registra la primera." />}
            ListFooterComponent={
                <Text style={styles.pie}>Estado en memoria · {unidades.length} unidad(es)</Text>
            }
        />
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 36, flexGrow: 1 },
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
    presionado: { opacity: 0.85 },
    nuevoTexto: { color: PALETTE.principal, fontWeight: '800', letterSpacing: 1 },
    pie: { textAlign: 'center', color: PALETTE.acento, marginTop: 12, fontSize: 12 },
});
