/**
 * Contrato TypeScript de la unidad de equipo, alineado con el DTO
 * UnidadEquipoResponse del backend (ADR-001). No es la entidad JPA:
 * describe el JSON que viaja por HTTP.
 */

// Catálogo cerrado: coincide con @Pattern del backend y con el CHECK de V3.
export const ESTADOS_OPERATIVOS = [
    'DISPONIBLE',
    'RESERVADA',
    'EN_USO',
    'EN_MANTENIMIENTO',
    'DE_BAJA',
] as const;

export type EstadoOperativo = (typeof ESTADOS_OPERATIVOS)[number];

export const ESTADO_OPERATIVO_LABELS: Record<EstadoOperativo, string> = {
    DISPONIBLE: 'Disponible',
    RESERVADA: 'Reservada',
    EN_USO: 'En uso',
    EN_MANTENIMIENTO: 'En mantenimiento',
    DE_BAJA: 'De baja',
};

export interface UnidadEquipo {
    id: number;
    equipoId: number;
    numeroSerie: string;
    estadoOperativo: EstadoOperativo;
    metricaUsoAcumulada: number;
    notasEstado: string | null;
    activo: boolean;
    createdAt: string; // OffsetDateTime en ISO-8601
}
