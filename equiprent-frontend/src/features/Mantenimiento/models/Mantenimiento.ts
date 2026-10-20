/**
 * Contrato TypeScript de la orden de mantenimiento, alineado con el DTO
 * MantenimientoResponse del backend (ADR-001). La relación 1:N con la unidad
 * se representa con unidadEquipoId (la FK mantenimiento.unidad_equipo_id).
 */

export const TIPOS_MANTENIMIENTO = ['PREVENTIVO', 'CORRECTIVO'] as const;
export type TipoMantenimiento = (typeof TIPOS_MANTENIMIENTO)[number];

export const ESTADOS_MANTENIMIENTO = ['EN_PROCESO', 'COMPLETADO', 'CANCELADO'] as const;
export type EstadoMantenimiento = (typeof ESTADOS_MANTENIMIENTO)[number];

export const TIPO_MANTENIMIENTO_LABELS: Record<TipoMantenimiento, string> = {
    PREVENTIVO: 'Preventivo',
    CORRECTIVO: 'Correctivo',
};

export const ESTADO_MANTENIMIENTO_LABELS: Record<EstadoMantenimiento, string> = {
    EN_PROCESO: 'En proceso',
    COMPLETADO: 'Completado',
    CANCELADO: 'Cancelado',
};

export interface Mantenimiento {
    id: number;
    unidadEquipoId: number;
    danoId: number | null;
    tipo: TipoMantenimiento;
    fechaIngreso: string; // ISO-8601 con zona horaria
    fechaEgresoEstimada: string;
    fechaEgresoReal: string | null;
    estado: EstadoMantenimiento;
    createdAt: string;
}
