import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '../../../../components/EmptyState';
import { FormularioMantenimientoRemoto } from '../../../../components/FormularioMantenimientoRemoto';
import { ReturnButton } from '../../../../components/ReturnButton';
import type { MantenimientoRemotoFormulario } from '../../../../domain/validaciones';
import { mensajeDeError } from '../../../../infra/http/apiClient';
import {
    aFormularioMantenimiento,
    aMantenimientoRequest,
    mantenimientosApi,
} from '../../../../infra/http/mantenimientosApi';
import { leerIdPositivo } from '../../../../utils/routeParams';

/**
 * Ruta /remoto/mantenimientos/editar/[id] (Guía 10): GET para precargar, PUT para guardar.
 * Cambiar la unidad REASIGNA la orden a otra unidad en PostgreSQL.
 */
export default function EditarOrdenRemotaScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const ordenId = leerIdPositivo(id);

    const [valorInicial, setValorInicial] = useState<MantenimientoRemotoFormulario | null>(null);
    const [error, setError] = useState<string | null>(ordenId === null ? 'ID de orden no válido.' : null);

    useEffect(() => {
        if (ordenId === null) return;
        let vigente = true;
        mantenimientosApi
            .obtener(ordenId)
            .then((dto) => vigente && setValorInicial(aFormularioMantenimiento(dto)))
            .catch((e: unknown) => vigente && setError(mensajeDeError(e)));
        return () => {
            vigente = false;
        };
    }, [ordenId]);

    if (error || ordenId === null) {
        return (
            <View style={styles.contenido}>
                <ReturnButton destinoSiNoHayHistorial="/remoto/mantenimientos" />
                <EmptyState mensaje={error ?? 'ID de orden no válido.'} />
            </View>
        );
    }

    return (
        <FormularioMantenimientoRemoto
            key={valorInicial ? 'cargado' : 'cargando'}
            valorInicial={valorInicial}
            textoBoton="Actualizar orden en PostgreSQL"
            enviar={async (datos) => {
                await mantenimientosApi.actualizar(ordenId, aMantenimientoRequest(datos));
                router.replace({ pathname: '/remoto/mantenimientos/[id]', params: { id: String(ordenId) } });
            }}
        />
    );
}

const styles = StyleSheet.create({
    contenido: { padding: 18, paddingBottom: 40 },
});
