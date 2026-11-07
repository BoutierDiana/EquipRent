import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { UnidadEquipo } from '../models/equiprent';
import {
    FORMULARIO_VACIO,
    tieneErrores,
    validarMantenimiento,
    type ErroresMantenimiento,
    type MantenimientoFormulario,
} from '../domain/validaciones';
import { PALETTE } from '../theme/palette';

type Props = {
    unidades: readonly UnidadEquipo[];
    /** Se llama solo cuando TODOS los campos son válidos. */
    alConfirmar: (datos: MantenimientoFormulario) => void;
};

// Color de error local del formulario (no forma parte de la paleta de marca).
const ERROR = '#f87171';
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/**
 * Formulario CONTROLADO: cada TextInput lee su valor del estado (useState)
 * y lo actualiza con onChangeText. Así la validación trabaja con datos actuales.
 */
export function MantenimientoForm({ unidades, alConfirmar }: Props) {
    const [datos, setDatos] = useState<MantenimientoFormulario>(FORMULARIO_VACIO);
    const [errores, setErrores] = useState<ErroresMantenimiento>({});

    // Actualiza un solo campo sin perder los demás.
    function cambiar<K extends keyof MantenimientoFormulario>(
        campo: K,
        valor: MantenimientoFormulario[K]
    ) {
        setDatos((anterior) => ({ ...anterior, [campo]: valor }));
    }

    function revisarDatos() {
        const nuevosErrores = validarMantenimiento(
            datos,
            unidades.map((u) => u.id)
        );
        setErrores(nuevosErrores);
        if (!tieneErrores(nuevosErrores)) {
            alConfirmar(datos);
        }
    }

    return (
        <View>
            {/* Unidad de equipo: lado 1 de la relación, primer campo obligatorio */}
            <Text style={styles.etiqueta}>Unidad de equipo (obligatorio)</Text>
            {unidades.map((unidad) => {
                const elegida = datos.unidadEquipoId === unidad.id;
                return (
                    <Pressable
                        key={unidad.id}
                        onPress={() => cambiar('unidadEquipoId', unidad.id)}
                        accessibilityRole="radio"
                        accessibilityLabel={`Elegir unidad ${unidad.codigoInventario}`}
                        accessibilityState={{ selected: elegida }}
                        style={[styles.opcion, elegida && styles.opcionElegida]}
                    >
                        <View style={[styles.radio, elegida && styles.radioElegido]}>
                            {elegida && <View style={styles.radioPunto} />}
                        </View>
                        <Text style={styles.opcionCodigo}>{unidad.codigoInventario}</Text>
                        <Text style={styles.opcionTexto}>
                            {unidad.marca} {unidad.modelo}
                        </Text>
                    </Pressable>
                );
            })}
            {errores.unidadEquipoId && <Text style={styles.error}>{errores.unidadEquipoId}</Text>}

            <Text style={styles.etiqueta}>Fecha (AAAA-MM-DD)</Text>
            <TextInput
                value={datos.fecha}
                onChangeText={(texto) => cambiar('fecha', texto)}
                placeholder="2026-03-10"
                placeholderTextColor={PALETTE.borde}
                autoCapitalize="none"
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                accessibilityLabel="Fecha del mantenimiento"
                style={[styles.input, errores.fecha && styles.inputError]}
            />
            {errores.fecha && <Text style={styles.error}>{errores.fecha}</Text>}

            <Text style={styles.etiqueta}>Descripción</Text>
            <TextInput
                value={datos.descripcion}
                onChangeText={(texto) => cambiar('descripcion', texto)}
                placeholder="Cambio de filtros y aceite hidráulico"
                placeholderTextColor={PALETTE.borde}
                accessibilityLabel="Descripción del mantenimiento"
                style={[styles.input, errores.descripcion && styles.inputError]}
            />
            {errores.descripcion && <Text style={styles.error}>{errores.descripcion}</Text>}

            <Text style={styles.etiqueta}>Costo (USD)</Text>
            <TextInput
                value={datos.costo}
                onChangeText={(texto) => cambiar('costo', texto)}
                placeholder="1250.00"
                placeholderTextColor={PALETTE.borde}
                keyboardType="decimal-pad"
                accessibilityLabel="Costo del mantenimiento en dólares"
                style={[styles.input, errores.costo && styles.inputError]}
            />
            {errores.costo && <Text style={styles.error}>{errores.costo}</Text>}

            <Pressable
                onPress={revisarDatos}
                accessibilityRole="button"
                accessibilityLabel="Revisar datos"
                style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
            >
                <Text style={styles.botonTexto}>Revisar datos</Text>
            </Pressable>

            <Text style={styles.nota}>Validar en el móvil no reemplaza validar en Spring Boot.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    etiqueta: {
        marginTop: 18,
        marginBottom: 8,
        color: PALETTE.principal,
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    opcion: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: PALETTE.superficie,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
    },
    opcionElegida: { backgroundColor: PALETTE.acentoClaro, borderColor: PALETTE.acento },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: PALETTE.secundario,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioElegido: { borderColor: PALETTE.lima },
    radioPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: PALETTE.lima },
    opcionCodigo: { fontFamily: MONO, color: PALETTE.lima, fontWeight: '700' },
    opcionTexto: { color: PALETTE.principal, fontWeight: '700' },
    input: {
        backgroundColor: '#130924', // cyberInput
        borderWidth: 1,
        borderColor: PALETTE.borde,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        color: PALETTE.principal,
        fontSize: 15,
    },
    inputError: { borderColor: ERROR },
    error: { marginTop: 6, color: ERROR, fontSize: 13 },
    boton: {
        marginTop: 26,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    botonPresionado: { opacity: 0.85 },
    botonTexto: {
        color: PALETTE.principal,
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 1,
    },
    nota: { marginTop: 14, textAlign: 'center', color: PALETTE.secundario, fontSize: 13 },
});