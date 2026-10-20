export interface UnidadEquipoCreateRequest {
    equipoId: number;
    codigoInventario: string;
    numeroSerie: string;
    marca: string;
    modelo: string;
    estadoOperativo: string;
    ubicacion: string;
    metricaUsoAcumulada: number;
    activo: boolean;
}