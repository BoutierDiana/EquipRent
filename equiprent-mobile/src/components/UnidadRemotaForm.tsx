import React, { useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { EQUIPOS_CATALOGO } from '../data/catalogoEquipos';
import {
    ESTADOS_OPERATIVOS,
    UNIDAD_REMOTA_VACIA,
    tieneErrores,
    validarUnidadRemota,
    type ErroresUnidadRemota,
    type UnidadRemotaFormulario,
} from '../domain/validaciones';
import { PALETTE } from '../theme/palette';
import { formatearCatalogo } from '../utils/formato';

type Props = {
    valorInicial?: UnidadRemotaFormulario;
    textoBoton: string;
    /** true al EDITAR: muestra el switch "activo" (al crear, toda unidad nace activa). */
    mostrarActivo?: boolean;
    /** true mientras la petición HTTP está en curso: bloquea el botón (evita doble envío). */
    enviando: boolean;
    /** Errores por campo devueltos por Spring Boot (400 @Valid). */
    erroresServidor?: Record<string, string>;
    alGuardar: (datos: UnidadRemotaFormulario) => void;
};

const ERROR = '#f87171';
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** Formulario CONTROLADO de UnidadEquipo REMOTA (contrato de /api/unidades-equipo). */
export function UnidadRemotaForm({
    valorInicial,
    textoBoton,
    mostrarActivo = false,
    enviando,
    erroresServidor = {},
    alGuardar,
}: Props) {
    const [datos, setDatos] = useState<UnidadRemotaFormulario>(valorInicial ?? UNIDAD_REMOTA_VACIA);
    const [errores, setErrores] = useState<ErroresUnidadRemota>({});

    function cambiar<K extends keyof UnidadRemotaFormulario>(campo: K, valor: UnidadRemotaFormulario[K]) {
        setDatos((anterior) => ({ ...anterior, [campo]: valor }));
    }

    function guardar() {
        if (enviando) return;
        const encontrados = validarUnidadRemota(
            datos,
            EQUIPOS_CATALOGO.map((e) => e.id)
        );
        setErrores(encontrados);
        if (!tieneErrores(encontrados)) alGuardar(datos);
    }

    // Primero el error local; si no hay, el que devolvió el servidor para ese campo.
    const errorDe = (campo: keyof ErroresUnidadRemota) => errores[campo] ?? erroresServidor[campo];

    return (
        <View>
            <Text style={styles.etiqueta}>Equipo (catálogo)</Text>
            {EQUIPOS_CATALOGO.map((equipo) => {
                const elegido = datos.equipoId === equipo.id;
                return (
                    <Pressable
                        key={equipo.id}
                        onPress={() => cambiar('equipoId', equipo.id)}
                        accessibilityRole="radio"
                        accessibilityLabel={`Elegir equipo ${equipo.nombre}`}
                        accessibilityState={{ selected: elegido }}
                        style={[styles.opcion, elegido && styles.opcionElegida]}
                    >
                        <View style={[styles.radio, elegido && styles.radioElegido]}>
                            {elegido && <View style={styles.radioPunto} />}
                        </View>
                        <View style={styles.opcionTextos}>
                            <Text style={styles.opcionCodigo}>{equipo.codigoModelo}</Text>
                            <Text style={styles.opcionTexto}>
                                {equipo.marca} · {equipo.nombre}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
            {errorDe('equipoId') && <Text style={styles.error}>{errorDe('equipoId')}</Text>}

            <Text style={styles.etiqueta}>Número de serie</Text>
            <TextInput
                value={datos.numeroSerie}
                onChangeText={(t) => cambiar('numeroSerie', t)}
                placeholder="SN-HON-000303"
                placeholderTextColor={PALETTE.borde}
                autoCapitalize="characters"
                maxLength={50}
                accessibilityLabel="Número de serie"
                style={[styles.input, styles.mono, errorDe('numeroSerie') && styles.inputError]}
            />
            {errorDe('numeroSerie') && <Text style={styles.error}>{errorDe('numeroSerie')}</Text>}

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
            {errorDe('estadoOperativo') && <Text style={styles.error}>{errorDe('estadoOperativo')}</Text>}

            <Text style={styles.etiqueta}>Métrica de uso acumulada (horas)</Text>
            <TextInput
                value={datos.metricaUsoAcumulada}
                onChangeText={(t) => cambiar('metricaUsoAcumulada', t)}
                placeholder="0"
                placeholderTextColor={PALETTE.borde}
                keyboardType="decimal-pad"
                accessibilityLabel="Métrica de uso acumulada"
                style={[styles.input, errorDe('metricaUsoAcumulada') && styles.inputError]}
            />
            {errorDe('metricaUsoAcumulada') && (
                <Text style={styles.error}>{errorDe('metricaUsoAcumulada')}</Text>
            )}

            <Text style={styles.etiqueta}>Notas de estado (opcional)</Text>
            <TextInput
                value={datos.notasEstado}
                onChangeText={(t) => cambiar('notasEstado', t)}
                placeholder="Unidad nueva en bodega central"
                placeholderTextColor={PALETTE.borde}
                multiline
                accessibilityLabel="Notas de estado"
                style={[styles.input, styles.multilinea]}
            />

            {mostrarActivo && (
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
            )}

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

            <Text style={styles.nota}>Se guarda en PostgreSQL mediante Spring Boot.</Text>
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
    multilinea: { minHeight: 70, textAlignVertical: 'top' },
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
    botonPresionado: { opacity: 0.7 },
    botonTexto: { color: PALETTE.principal, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    nota: { marginTop: 14, textAlign: 'center', color: PALETTE.secundario, fontSize: 13 },
});
