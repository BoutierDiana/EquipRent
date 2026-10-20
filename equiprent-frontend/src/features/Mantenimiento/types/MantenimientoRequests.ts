export interface MantenimientoFormData {
    unidadEquipoId: string;
    tipo: string;
    estado: string;
    descripcion: string;
    costo: string;
    fechaIngreso: string;
    fechaEgresoEstimada: string;
}

export interface MantenimientoRequest {
    unidadEquipoId: number;
    tipo: string;
    estado: string;
    descripcion: string;
    costo: number;
    fechaIngreso: string;
    fechaEgresoEstimada: string;
}