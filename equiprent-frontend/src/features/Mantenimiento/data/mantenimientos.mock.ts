import type { Mantenimiento } from '../models/Mantenimiento';

// Datos simulados (Guía 03) con la misma forma que GET /api/mantenimientos.
// Coinciden con V4__seed_mantenimiento.sql.
export const mantenimientosMock: Mantenimiento[] = [
    { id: 1, unidadEquipoId: 3, danoId: null, tipo: 'CORRECTIVO', fechaIngreso: '2026-10-14T08:30:00-04:00', fechaEgresoEstimada: '2026-10-24T18:00:00-04:00', fechaEgresoReal: null, estado: 'EN_PROCESO', createdAt: '2026-10-14T08:31:00-04:00' },
    { id: 2, unidadEquipoId: 3, danoId: null, tipo: 'PREVENTIVO', fechaIngreso: '2026-07-02T09:00:00-04:00', fechaEgresoEstimada: '2026-07-03T17:00:00-04:00', fechaEgresoReal: '2026-07-03T15:30:00-04:00', estado: 'COMPLETADO', createdAt: '2026-07-02T09:01:00-04:00' },
    { id: 3, unidadEquipoId: 1, danoId: null, tipo: 'PREVENTIVO', fechaIngreso: '2026-09-01T08:00:00-04:00', fechaEgresoEstimada: '2026-09-02T12:00:00-04:00', fechaEgresoReal: '2026-09-02T10:45:00-04:00', estado: 'COMPLETADO', createdAt: '2026-09-01T08:01:00-04:00' },
    { id: 4, unidadEquipoId: 2, danoId: null, tipo: 'PREVENTIVO', fechaIngreso: '2026-08-20T08:00:00-04:00', fechaEgresoEstimada: '2026-08-21T18:00:00-04:00', fechaEgresoReal: null, estado: 'CANCELADO', createdAt: '2026-08-20T08:01:00-04:00' },
];
