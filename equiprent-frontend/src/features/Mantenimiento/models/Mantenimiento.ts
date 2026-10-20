export interface Mantenimiento {
    id: number;
    unidadEquipoId: number;
    fecha: string;
    descripcion: string;
    costo: number;
    tipoMantenimiento: string;
    activo: boolean;
}