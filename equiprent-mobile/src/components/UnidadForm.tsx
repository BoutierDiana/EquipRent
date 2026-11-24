import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import type { UnidadEquipo } from '../models/equiprent';
import {
    ESTADOS_OPERATIVOS,
    UNIDAD_VACIA,
    normalizarCodigo,
    tieneErrores,
    validarUnidad,
    type ErroresUnidad,
    type UnidadFormulario,
} from '../domain/validaciones';
import { PALETTE } from '../theme/palette';
import { formatearCatalogo } from '../utils/formato';

type Props = {
    /** Unidades ya registradas: se usan para impedir códigos o series repetidos. */
    existentes: readonly UnidadEquipo[];
    /** Datos iniciales al EDITAR; si se omite, el formulario empieza vacío (CREAR). */
    valorInicial?: UnidadFormulario;
    /** id de la unidad que se edita (se excluye al buscar duplicados). */
    idActual?: number | null;
    textoBoton: string;
    /** Se llama solo con datos válidos y ya normalizados. */
    alGuardar: (datos: UnidadFormulario) => void;
};

const ERROR = '#f87171';
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Formulario CONTROLADO reutilizable para crear y editar una UnidadEquipo. */
export function UnidadForm({ existentes, valorInicial, idActual = null, textoBoton, alGuardar }: Props) {
    const [datos, setDatos] = useState<UnidadFormulario>(valorInicial ?? UNIDAD_VACIA);
    const [errores, setErrores] = useState<ErroresUnidad>({});

    function cambiar<K extends keyof UnidadFormulario>(campo: K, valor: UnidadFormulario[K]) {
        setDatos((anterior) => ({ ...anterior, [campo]: valor }));
    }

    function guardar() {
        const encontrados = validarUnidad(datos, existentes, idActual);
        setErrores(encontrados);
        if (tieneErrores(encontrados)) return;
        alGuardar({
            ...datos,
            codigoInventario: normalizarCodigo(datos.codigoInventario),
            numeroSerie: normalizarCodigo(datos.numeroSerie),
            marca: datos.marca.trim(),
            modelo: datos.modelo.trim(),
        });
    }

    return (
        <View>
            <Text style={styles.etiqueta}>Código de inventario</Text>
            <TextInput
                value={datos.codigoInventario}
                onChangeText={(t) => cambiar('codigoInventario', t)}
                placeholder="EQ-005"
                placeholderTextColor={PALETTE.borde}
                autoCapitalize="characters"
                accessibilityLabel="Código de inventario"
                style={[styles.input, styles.mono, errores.codigoInventario && styles.inputError]}
            />
            {errores.codigoInventario && <Text style={styles.error}>{errores.codigoInventario}</Text>}

            <Text style={styles.etiqueta}>Número de serie</Text>
            <TextInput
                value={datos.numeroSerie}
                onChangeText={(t) => cambiar('numeroSerie', t)}
                placeholder="CAT-320-GC"
                placeholderTextColor={PALETTE.borde}
                autoCapitalize="characters"
                accessibilityLabel="Número de serie"
                style={[styles.input, styles.mono, errores.numeroSerie && styles.inputError]}
            />
            {errores.numeroSerie && <Text style={styles.error}>{errores.numeroSerie}</Text>}

            <Text style={styles.etiqueta}>Marca</Text>
            <TextInput
                value={datos.marca}
                onChangeText={(t) => cambiar('marca', t)}
                placeholder="Caterpillar"
                placeholderTextColor={PALETTE.borde}
                accessibilityLabel="Marca"
                style={[styles.input, errores.marca && styles.inputError]}
            />
            {errores.marca && <Text style={styles.error}>{errores.marca}</Text>}

            <Text style={styles.etiqueta}>Modelo</Text>
            <TextInput
                value={datos.modelo}
                onChangeText={(t) => cambiar('modelo', t)}
                placeholder="320 GC"
                placeholderTextColor={PALETTE.borde}
                accessibilityLabel="Modelo"
                style={[styles.input, errores.modelo && styles.inputError]}
            />
            {errores.modelo && <Text style={styles.error}>{errores.modelo}</Text>}

            <Text style={styles.etiqueta}>Estado operativo</Text>
            <View style={styles.chips}>
                {ESTADOS_OPERATIVOS.map((estado) => {
                    const elegido = datos.estadoOperativo === estado;
                    return (
                        <Pressable
                            key={estado}
                            onPress={() => cambiar('estadoOperativo', estado)}
                            accessibilityRole="radio"
                            accessibilityLabel={`Estado ${formatearCatalogo(estado)}`}
                            accessibilityState={{ selected: elegido }}
                            style={[styles.chip, elegido && styles.chipElegido]}
                        >
                            <Text style={[styles.chipTexto, elegido && styles.chipTextoElegido]}>
                                {formatearCatalogo(estado)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
            {errores.estadoOperativo && <Text style={styles.error}>{errores.estadoOperativo}</Text>}

            <View style={styles.fila}>
                <Text style={styles.etiqueta}>Registro activo</Text>
                <Switch
                    value={datos.activo}
                    onValueChange={(v) => cambiar('activo', v)}
                    accessibilityLabel="Unidad activa"
                    trackColor={{ false: PALETTE.borde, true: PALETTE.acento }}
                    thumbColor={datos.activo ? PALETTE.lima : PALETTE.secundario}
                />
            </View>

            <Pressable
                onPress={guardar}
                accessibilityRole="button"
                accessibilityLabel={textoBoton}
                style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
            >
                <Text style={styles.botonTexto}>{textoBoton}</Text>
            </Pressable>

            <Text style={styles.nota}>Se guarda en memoria: al recargar la app vuelven los datos demo.</Text>
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
    mono: { fontFamily: MONO },
    inputError: { borderColor: ERROR },
    error: { marginTop: 6, color: ERROR, fontSize: 13 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        borderWidth: 1,
        borderColor: PALETTE.borde,
        backgroundColor: PALETTE.superficie,
        borderRadius: 99,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    chipElegido: { backgroundColor: PALETTE.acentoClaro, borderColor: PALETTE.lima },
    chipTexto: { color: PALETTE.secundario, fontWeight: '700', fontSize: 12 },
    chipTextoElegido: { color: PALETTE.lima },
    fila: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    boton: {
        marginTop: 26,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    botonPresionado: { opacity: 0.85 },
    botonTexto: { color: PALETTE.principal, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    nota: { marginTop: 14, textAlign: 'center', color: PALETTE.secundario, fontSize: 13 },
});
