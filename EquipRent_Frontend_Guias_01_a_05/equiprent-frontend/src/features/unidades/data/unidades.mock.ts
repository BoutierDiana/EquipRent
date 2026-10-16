import type { UnidadEquipo } from '../models/UnidadEquipo';

export const unidadesMock: UnidadEquipo[] = [
  { id: 1, equipoId: 1, codigoUnidad: 'UN-TAL-001-01', numeroSerie: 'BSH-2024-0001', estado: 'DISPONIBLE', fechaAdquisicion: '2024-02-10', valorReferencial: 950, observacion: null },
  { id: 2, equipoId: 1, codigoUnidad: 'UN-TAL-001-02', numeroSerie: 'BSH-2024-0002', estado: 'MANTENIMIENTO', fechaAdquisicion: '2024-02-10', valorReferencial: 950, observacion: 'Cambio de carbones' },
  { id: 3, equipoId: 2, codigoUnidad: 'UN-PRO-001-01', numeroSerie: 'EPS-X49-7781', estado: 'ENTREGADA', fechaAdquisicion: '2023-11-05', valorReferencial: 4800, observacion: null },
  { id: 4, equipoId: 3, codigoUnidad: 'UN-GEN-001-01', numeroSerie: 'HND-EG-55120', estado: 'DISPONIBLE', fechaAdquisicion: '2022-06-20', valorReferencial: 9800, observacion: null },
  { id: 5, equipoId: 999, codigoUnidad: 'UN-XXX-000-01', numeroSerie: null, estado: 'BLOQUEADA', fechaAdquisicion: null, valorReferencial: null, observacion: 'Equipo inexistente: prueba de la Guía 03' },
];
