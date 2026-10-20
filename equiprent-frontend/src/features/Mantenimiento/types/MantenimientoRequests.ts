import type {
    MantenimientoCreateRequest,
    MantenimientoUpdateRequest,
} from './MantenimientoCreateRequest';

/**
 * Estado del formulario: todo string porque así llega desde <select> y
 * <input type="datetime-local">. Se valida y luego se convierte al payload.
 */
export interface MantenimientoFormData {
    unidadEquipoId: string;
    tipo: string;
    estado: string;
    fechaIngreso: string;
    fechaEgresoEstimada: string;
    fechaEgresoReal: string;
}

/** Payload que el formulario envía en POST o PUT. */
export type MantenimientoRequest = MantenimientoCreateRequest | MantenimientoUpdateRequest;
