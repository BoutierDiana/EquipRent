import React, { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { nombreEquipo } from '../data/catalogoEquipos';
import {
    ESTADOS_MANTENIMIENTO,
    MANTENIMIENTO_REMOTO_VACIO,
    TIPOS_MANTENIMIENTO,
    tieneErrores,
    validarMantenimientoRemoto,
    type ErroresMantenimientoRemoto,
    type MantenimientoRemotoFormulario,
} from '../domain/validaciones';
import type { UnidadEquipoDto } from '../infra/http/unidadesApi';
import { PALETTE } from '../theme/palette';
import { formatearCatalogo } from '../utils/formato';

type Props = {
    /** Unidades REALES de PostgreSQL (lado 1): solo se puede elegir una existente. */
    unidades: readonly UnidadEquipoDto[];
    valorInicial?: MantenimientoRemotoFormulario;
    textoBoton: string;
    enviando: boolean;
    erroresServidor?: Record<string, string>;
    alGuardar: (datos: MantenimientoRemotoFormulario) => void;
};

const ERROR = '#f87171';
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Formulario CONTROLADO de una orden de mantenimiento REMOTA (/api/mantenimientos). */
export function MantenimientoRemotoForm({
    unidades,
    valorInicial,
    textoBoton,
    enviando,
    erroresServidor = {},
    alGuardar,
}: Props) {
    const [datos, setDatos] = useState<MantenimientoRemotoFormulario>(
        valorInicial ?? MANTENIMIENTO_REMOTO_VACIO
    );
    const [errores, setErrores] = useState<ErroresMantenimientoRemoto>({});

    function cambiar<K extends keyof MantenimientoRemotoFormulario>(
        campo: K,
        valor: MantenimientoRemotoFormulario[K]
    ) {
        setDatos((anterior) => ({ ...anterior, [campo]: valor }));
    }

    function guardar() {
        if (enviando) return;
        const encontrados = validarMantenimientoRemoto(
            datos,
            unidades.map((u) => u.id)
        );
        setErrores(encontrados);
        if (!tieneErrores(encontrados)) alGuardar(datos);
    }

    const errorDe = (campo: keyof ErroresMantenimientoRemoto) => errores[campo] ?? erroresServidor[campo];

    function CampoFecha({ campo, etiqueta, placeholder }: {
        campo: 'fechaIngreso' | 'fechaEgresoEstimada' | 'fechaEgresoReal';
        etiqueta: string;
        placeholder: string;
    }) {
        return (
            <>
                <Text style={styles.etiqueta}>{etiqueta}</Text>
                <TextInput
                    value={datos[campo]}
                    onChangeText={(t) => cambiar(campo, t)}
                    placeholder={placeholder}
                    placeholderTextColor={PALETTE.borde}
                    autoCapitalize="none"
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                    accessibilityLabel={etiqueta}
                    style={[styles.input, styles.mono, errorDe(campo) && styles.inputError]}
                />
                {errorDe(campo) && <Text style={styles.error}>{errorDe(campo)}</Text>}
            </>
        );
    }

    return (
        <View>
            <Text style={styles.etiqueta}>Unidad de equipo (PostgreSQL)</Text>
            {unidades.map((unidad) => {
                const elegida = datos.unidadEquipoId === unidad.id;
                return (
                    <Pressable
                        key={unidad.id}
                        onPress={() => cambiar('unidadEquipoId', unidad.id)}
                        accessibilityRole="radio"
                        accessibilityLabel={`Elegir unidad ${unidad.numeroSerie}`}
                        accessibilityState={{ selected: elegida }}
                        style={[styles.opcion, elegida && styles.opcionElegida]}
                    >
                        <View style={[styles.radio, elegida && styles.radioElegido]}>
                            {elegida && <View style={styles.radioPunto} />}
                        </View>
                        <View style={styles.opcionTextos}>
                            <Text style={styles.opcionCodigo}>{unidad.numeroSerie}</Text>
                            <Text style={styles.opcionTexto}>{nombreEquipo(unidad.equipoId)}</Text>
                        </View>
                    </Pressable>
                );
            })}
            {errorDe('unidadEquipoId') && <Text style={styles.error}>{errorDe('unidadEquipoId')}</Text>}

            <Text style={styles.etiqueta}>Tipo</Text>
            <Chips
                opciones={TIPOS_MANTENIMIENTO}
                valor={datos.tipo}
                alElegir={(v) => cambiar('tipo', v)}
            />
            {errorDe('tipo') && <Text style={styles.error}>{errorDe('tipo')}</Text>}

            {CampoFecha({ campo: 'fechaIngreso', etiqueta: 'Fecha de ingreso (AAAA-MM-DD)', placeholder: '2026-11-24' })}
            {CampoFecha({
                campo: 'fechaEgresoEstimada',
                etiqueta: 'Egreso estimado (AAAA-MM-DD)',
                placeholder: '2026-11-26',
            })}
            {CampoFecha({
                campo: 'fechaEgresoReal',
                etiqueta: 'Egreso real (opcional)',
                placeholder: 'Vacío si sigue en taller',
            })}

            <Text style={styles.etiqueta}>Estado de la orden</Text>
            <Chips
                opciones={ESTADOS_MANTENIMIENTO}
                valor={datos.estado}
                alElegir={(v) => cambiar('estado', v)}
            />
            {errorDe('estado') && <Text style={styles.error}>{errorDe('estado')}</Text>}

            <Pressable
                onPress={guardar}
                disabled={enviando}
                accessibilityRole="button"
                accessibilityLabel={textoBoton}
                accessibilityState={{ disabled: enviando, busy: enviando }}
                style={({ pressed }) => [styles.boton, (pressed || enviando) && styles.botonPresionado]}
            >
                {enviando ? (
                    <ActivityIndicator color={PALETTE.principal} />
                ) : (
                    <Text style={styles.botonTexto}>{textoBoton}</Text>
                )}
            </Pressable>
            <Text style={styles.nota}>El backend vuelve a validar: egreso nunca antes del ingreso.</Text>
        </View>
    );
}

function Chips({
    opciones,
    valor,
    alElegir,
}: {
    opciones: readonly string[];
    valor: string;
    alElegir: (v: string) => void;
}) {
    return (
        <View style={styles.chips}>
            {opciones.map((opcion) => {
                const elegido = valor === opcion;
                return (
                    <Pressable
                        key={opcion}
                        onPress={() => alElegir(opcion)}
                        accessibilityRole="radio"
                        accessibilityLabel={formatearCatalogo(opcion)}
                        accessibilityState={{ selected: elegido }}
                        style={[styles.chip, elegido && styles.chipElegido]}
                    >
                        <Text style={[styles.chipTexto, elegido && styles.chipTextoElegido]}>
                            {formatearCatalogo(opcion)}
                        </Text>
                    </Pressable>
                );
            })}
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
    opcionTextos: { flexShrink: 1 },
    opcionCodigo: { fontFamily: MONO, color: PALETTE.lima, fontWeight: '700', fontSize: 12 },
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
    boton: {
        marginTop: 26,
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: PALETTE.acento,
        borderRadius: 10,
    },
    botonPresionado: { opacity: 0.7 },
    botonTexto: { color: PALETTE.principal, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    nota: { marginTop: 14, textAlign: 'center', color: PALETTE.secundario, fontSize: 13 },
});
