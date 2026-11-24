import React, { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ReturnButton } from '../../components/ReturnButton';
import { mensajeDeError } from '../../infra/http/apiClient';
import { fotosApi, type FotoEvidenciaDto } from '../../infra/http/fotosApi';
import { mantenimientosApi, type MantenimientoDto } from '../../infra/http/mantenimientosApi';
import { useAuth } from '../../state/AuthContext';
import { PALETTE } from '../../theme/palette';
import { formatearCatalogo, formatearFecha } from '../../utils/formato';
import { leerIdPositivo } from '../../utils/routeParams';

const MAXIMO_BYTES = 4_000_000; // mismo límite que FotoEvidenciaService

/**
 * Ruta /remoto/fotos[?mantenimientoId=] (Guía 13): evidencia fotográfica de una orden.
 *  1) Elegir la orden.  2) Galería o cámara (permiso en tiempo de ejecución).
 *  3) Vista previa LOCAL (aún no se envía).  4) Subir con multipart/form-data.
 *  5) Ver las fotos ya guardadas en el servidor (la petición lleva el token).
 */
export default function FotosEvidenciaScreen() {
    const { mantenimientoId } = useLocalSearchParams<{ mantenimientoId?: string }>();
    const { token } = useAuth();

    const [ordenes, setOrdenes] = useState<MantenimientoDto[]>([]);
    const [ordenId, setOrdenId] = useState<number | null>(leerIdPositivo(mantenimientoId));
    const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);
    const [subidas, setSubidas] = useState<FotoEvidenciaDto[]>([]);
    const [estado, setEstado] = useState('Elige una orden y luego una imagen.');
    const [permisoBloqueado, setPermisoBloqueado] = useState(false);
    const [ocupado, setOcupado] = useState(false);

    useEffect(() => {
        let vigente = true;
        mantenimientosApi
            .listar()
            .then((lista) => vigente && setOrdenes(lista))
            .catch((e: unknown) => vigente && setEstado(mensajeDeError(e)));
        return () => {
            vigente = false;
        };
    }, []);

    const cargarSubidas = useCallback(async (id: number) => {
        try {
            setSubidas(await fotosApi.listar(id));
        } catch (e) {
            setSubidas([]);
            setEstado(mensajeDeError(e));
        }
    }, []);

    useEffect(() => {
        if (ordenId !== null) void cargarSubidas(ordenId);
    }, [ordenId, cargarSubidas]);

    function elegirOrden(id: number) {
        setOrdenId(id);
        setImagen(null);
        setEstado('Ahora elige una imagen de la galería o toma una foto.');
    }

    async function elegir(origen: 'camara' | 'galeria') {
        if (ordenId === null) {
            setEstado('Primero selecciona una orden de mantenimiento.');
            return;
        }
        setPermisoBloqueado(false);
        try {
            if (origen === 'camara') {
                // La cámara SIEMPRE pide permiso en tiempo de ejecución.
                const permiso = await ImagePicker.requestCameraPermissionsAsync();
                if (!permiso.granted) {
                    setPermisoBloqueado(!permiso.canAskAgain);
                    setEstado(
                        permiso.canAskAgain
                            ? 'Permiso de cámara denegado. Puedes usar la galería.'
                            : 'La cámara está bloqueada para EquipRent. Actívala en Ajustes.'
                    );
                    return;
                }
            }
            // Galería: el selector del sistema (Photo Picker) solo entrega la imagen elegida,
            // sin dar acceso a TODA la galería, por eso no necesita permiso amplio.
            const opciones: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.7 };
            const resultado =
                origen === 'camara'
                    ? await ImagePicker.launchCameraAsync(opciones)
                    : await ImagePicker.launchImageLibraryAsync(opciones);
            if (resultado.canceled || resultado.assets.length === 0) {
                setEstado('Selección cancelada.');
                return;
            }
            const asset = resultado.assets[0];
            if (asset.fileSize && asset.fileSize > MAXIMO_BYTES) {
                setEstado('La imagen supera 4 MB. Elige otra o tómala con menor resolución.');
                return;
            }
            setImagen(asset);
            setEstado('Vista previa local: todavía NO se envió al servidor.');
        } catch (e) {
            // Por ejemplo, un emulador sin cámara configurada.
            setEstado(`No se pudo abrir la ${origen === 'camara' ? 'cámara' : 'galería'}: ${mensajeDeError(e)}`);
        }
    }

    async function subir() {
        if (ordenId === null || !imagen || ocupado) return;
        setOcupado(true);
        try {
            const foto = await fotosApi.subir(ordenId, imagen);
            setEstado(`Guardada en el servidor: ${foto.filename} (${Math.round(foto.size / 1024)} KB).`);
            setImagen(null);
            await cargarSubidas(ordenId);
        } catch (e) {
            setEstado(mensajeDeError(e));
        } finally {
            setOcupado(false);
        }
    }

    const cabeceras = token ? { Authorization: `Bearer ${token}` } : undefined;

    return (
        <ScrollView contentContainerStyle={styles.contenido}>
            <ReturnButton destinoSiNoHayHistorial="/remoto" />
            <Text style={styles.etiquetaSuperior}>GUÍA 13 · CÁMARA Y GALERÍA</Text>
            <Text style={styles.titulo}>Evidencia fotográfica</Text>
            <Text style={styles.ayuda}>
                Adjunta fotos del equipo a una orden de taller. Si el emulador no tiene cámara, usa la galería.
            </Text>

            <Text style={styles.paso}>1 · Orden de mantenimiento</Text>
            {ordenes.length === 0 && <Text style={styles.ayuda}>No hay órdenes en PostgreSQL todavía.</Text>}
            {ordenes.map((o) => {
                const elegida = o.id === ordenId;
                return (
                    <Pressable
                        key={o.id}
                        onPress={() => elegirOrden(o.id)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: elegida }}
                        style={[styles.opcion, elegida && styles.opcionElegida]}
                    >
                        <View style={[styles.radio, elegida && styles.radioElegido]}>
                            {elegida && <View style={styles.radioPunto} />}
                        </View>
                        <Text style={styles.opcionTexto}>
                            Orden #{o.id} · {formatearCatalogo(o.tipo)} · {formatearCatalogo(o.estado)}
                        </Text>
                    </Pressable>
                );
            })}

            <Text style={styles.paso}>2 · Imagen</Text>
            <View style={styles.filaBotones}>
                <Boton texto="Galería" onPress={() => void elegir('galeria')} />
                <Boton texto="Tomar foto" onPress={() => void elegir('camara')} />
            </View>
            {permisoBloqueado && (
                <Pressable onPress={() => void Linking.openSettings()} accessibilityRole="button" style={styles.ajustes}>
                    <Text style={styles.ajustesTexto}>Abrir Ajustes de la app</Text>
                </Pressable>
            )}

            {imagen && (
                <View style={styles.marco}>
                    <Image source={{ uri: imagen.uri }} style={styles.preview} resizeMode="contain" />
                    <Text style={styles.meta}>
                        {imagen.width}×{imagen.height}
                        {imagen.fileSize ? ` · ${Math.round(imagen.fileSize / 1024)} KB` : ''} · local
                    </Text>
                </View>
            )}

            <Text style={styles.paso}>3 · Enviar</Text>
            <Pressable
                onPress={() => void subir()}
                disabled={!imagen || ocupado}
                accessibilityRole="button"
                accessibilityState={{ disabled: !imagen || ocupado, busy: ocupado }}
                style={({ pressed }) => [styles.subir, (!imagen || ocupado || pressed) && styles.presionado]}
            >
                {ocupado ? (
                    <ActivityIndicator color={PALETTE.principal} />
                ) : (
                    <Text style={styles.subirTexto}>Subir al backend</Text>
                )}
            </Pressable>
            <Text accessibilityRole="alert" style={styles.estado}>
                {estado}
            </Text>

            {ordenId !== null && (
                <>
                    <Text style={styles.paso}>Fotos guardadas de la orden #{ordenId} ({subidas.length})</Text>
                    {subidas.length === 0 && <Text style={styles.ayuda}>Esta orden aún no tiene evidencia.</Text>}
                    <View style={styles.galeria}>
                        {subidas.map((f) => (
                            <View key={f.filename} style={styles.miniatura}>
                                <Image
                                    source={{ uri: fotosApi.url(ordenId, f.filename), headers: cabeceras }}
                                    style={styles.miniImagen}
                                    resizeMode="cover"
                                    accessibilityLabel={`Foto subida el ${formatearFecha(f.subidaEn)}`}
                                />
                                <Text style={styles.miniTexto}>{formatearFecha(f.subidaEn)}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}
        </ScrollView>
    );
}

function Boton({ texto, onPress }: { texto: string; onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
        >
            <Text style={styles.botonTexto}>{texto}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 45 },
    etiquetaSuperior: { fontSize: 12, fontWeight: '800', color: PALETTE.acento, letterSpacing: 1 },
    titulo: { marginTop: 6, fontSize: 24, fontWeight: '800', color: PALETTE.principal },
    ayuda: { marginTop: 8, color: PALETTE.secundario, lineHeight: 21 },
    paso: {
        marginTop: 22,
        marginBottom: 6,
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
        marginTop: 8,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        backgroundColor: PALETTE.superficie,
    },
    opcionElegida: { borderColor: PALETTE.acento, backgroundColor: PALETTE.acentoClaro },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: PALETTE.borde,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioElegido: { borderColor: PALETTE.lima },
    radioPunto: { width: 8, height: 8, borderRadius: 4, backgroundColor: PALETTE.lima },
    opcionTexto: { color: PALETTE.principal, flexShrink: 1 },
    filaBotones: { flexDirection: 'row', gap: 10, marginTop: 6 },
    boton: {
        flex: 1,
        minHeight: 48,
        justifyContent: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.acento,
        backgroundColor: PALETTE.acentoClaro,
    },
    botonTexto: { color: PALETTE.principal, fontWeight: '800', textAlign: 'center' },
    ajustes: { marginTop: 10, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: PALETTE.inactivo },
    ajustesTexto: { color: PALETTE.inactivo, fontWeight: '800', textAlign: 'center' },
    marco: {
        marginTop: 14,
        padding: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: PALETTE.lima,
        backgroundColor: PALETTE.superficie,
    },
    preview: { width: '100%', height: 220 },
    meta: { marginTop: 6, color: PALETTE.secundario, fontSize: 12, textAlign: 'center' },
    subir: {
        minHeight: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: PALETTE.acento,
    },
    subirTexto: { color: PALETTE.principal, fontSize: 16, fontWeight: '800', letterSpacing: 1 },
    presionado: { opacity: 0.55 },
    estado: { marginTop: 12, color: PALETTE.principal, lineHeight: 20 },
    galeria: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 6 },
    miniatura: { width: '47%' },
    miniImagen: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: PALETTE.borde,
        backgroundColor: PALETTE.superficie,
    },
    miniTexto: { marginTop: 4, color: PALETTE.secundario, fontSize: 11 },
});
