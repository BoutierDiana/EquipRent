/**
 * Lo que el usuario está escribiendo. Los números se guardan como string
 * porque así los entregan los <input>; se convierten después de validar.
 */
export interface UnidadEquipoFormData {
    equipoId: string;
    numeroSerie: string;
    estadoOperativo: string;
    metricaUsoAcumulada: string;
    notasEstado: string;
    activo: boolean;
}
