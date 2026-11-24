import type { UnidadEquipoDto } from '../infra/http/unidadesApi';

/**
 * Regla PURA de la sincronización offline (Guía 12, extraída en la Guía 14 para probarla):
 * ¿la unidad del servidor sigue igual que cuando se descargó al teléfono?
 * Solo compara los campos editables; id y createdAt no cambian con un PUT.
 */
export function mismaVersion(a: UnidadEquipoDto, b: UnidadEquipoDto): boolean {
    return (
        a.equipoId === b.equipoId &&
        a.numeroSerie === b.numeroSerie &&
        a.estadoOperativo === b.estadoOperativo &&
        Number(a.metricaUsoAcumulada) === Number(b.metricaUsoAcumulada) &&
        (a.notasEstado ?? '') === (b.notasEstado ?? '') &&
        a.activo === b.activo
    );
}
