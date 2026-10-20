import type { UnidadEquipo } from '../models/UnidadEquipo';

// Datos simulados (Guía 03) con la misma forma que devuelve GET /api/unidades-equipo.
// Coinciden con V2__seed_core.sql para que mock y backend cuenten la misma historia.
export const unidadesMock: UnidadEquipo[] = [
    { id: 1, equipoId: 1, numeroSerie: 'SN-MAK-000124', estadoOperativo: 'DISPONIBLE', metricaUsoAcumulada: 12.5, notasEstado: 'Equipo con mantenimiento preventivo reciente', activo: true, createdAt: '2026-09-01T08:00:00-04:00' },
    { id: 2, equipoId: 2, numeroSerie: 'SN-LAY-000201', estadoOperativo: 'EN_USO', metricaUsoAcumulada: 45, notasEstado: 'Entregado en obra norte', activo: true, createdAt: '2026-09-01T08:00:00-04:00' },
    { id: 3, equipoId: 3, numeroSerie: 'SN-HON-000301', estadoOperativo: 'EN_MANTENIMIENTO', metricaUsoAcumulada: 180, notasEstado: 'Requiere cambio de filtro y bujías', activo: true, createdAt: '2026-09-01T08:00:00-04:00' },
    { id: 4, equipoId: 3, numeroSerie: 'SN-HON-000302', estadoOperativo: 'DISPONIBLE', metricaUsoAcumulada: 10, notasEstado: 'Unidad seminueva en bodega central', activo: true, createdAt: '2026-09-01T08:00:00-04:00' },
];
