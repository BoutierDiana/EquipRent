export interface UnidadEquipoFormData {
    codigoInventario: string;
    numeroSerie: string;
    marca: string;
    modelo: string;
    estadoOperativo: string;
    ubicacion: string; // Práctica: campo de ubicación/dirección obligatorio
    activo: boolean;
}