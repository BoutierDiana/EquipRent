export interface MantenimientoCreateRequest {
    unidadEquipoId: number;
    danoId?: number | null;
    tipo: 'PREVENTIVO' | 'CORRECTIVO';
    fechaIngreso: string;
    fechaEgresoEstimada: string;
    fechaEgresoReal?: string | null;
    estado: 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
}