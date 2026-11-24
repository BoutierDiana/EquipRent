import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormularioMantenimientoRemoto } from '../../../components/FormularioMantenimientoRemoto';
import { MANTENIMIENTO_REMOTO_VACIO } from '../../../domain/validaciones';
import { aMantenimientoRequest, mantenimientosApi } from '../../../infra/http/mantenimientosApi';
import { leerIdPositivo } from '../../../utils/routeParams';

/**
 * Ruta /remoto/mantenimientos/nuevo (Guía 10): POST /api/mantenimientos.
 * /remoto/mantenimientos/nuevo?unidadId=3 preselecciona la unidad (desde su ficha).
 */
export default function NuevaOrdenRemotaScreen() {
    const router = useRouter();
    const { unidadId } = useLocalSearchParams<{ unidadId?: string }>();
    const preseleccion = leerIdPositivo(unidadId);

    return (
        <FormularioMantenimientoRemoto
            valorInicial={{ ...MANTENIMIENTO_REMOTO_VACIO, unidadEquipoId: preseleccion }}
            textoBoton="Guardar orden en PostgreSQL"
            enviar={async (datos) => {
                const creada = await mantenimientosApi.crear(aMantenimientoRequest(datos));
                // Vuelve a la ficha de la unidad dueña si se entró desde ella; si no, a la lista.
                if (preseleccion !== null) {
                    router.replace({
                        pathname: '/remoto/unidades/[id]',
                        params: { id: String(creada.unidadEquipoId) },
                    });
                } else {
                    router.replace('/remoto/mantenimientos');
                }
            }}
        />
    );
}
