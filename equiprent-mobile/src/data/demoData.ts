import type { Mantenimiento, UnidadEquipo } from '../models/equiprent';

// Datos de demostración para el laboratorio.
// NO provienen de Spring Boot ni de PostgreSQL.

export const UNIDADES: readonly UnidadEquipo[] = [
  { id: 1, codigoInventario: 'EQ-001', numeroSerie: 'CAT-988-X1', marca: 'Caterpillar', modelo: '988K', estadoOperativo: 'DISPONIBLE', activo: true },
  { id: 2, codigoInventario: 'EQ-002', numeroSerie: 'KOM-WA-470', marca: 'Komatsu', modelo: 'WA470', estadoOperativo: 'DISPONIBLE', activo: true },
  { id: 3, codigoInventario: 'EQ-003', numeroSerie: 'VOL-A40G', marca: 'Volvo', modelo: 'A40G', estadoOperativo: 'EN_TALLER', activo: false },
  { id: 4, codigoInventario: 'EQ-004', numeroSerie: 'JCB-3CX-PRO', marca: 'JCB', modelo: '3CX', estadoOperativo: 'DISPONIBLE', activo: true },
];

export const MANTENIMIENTOS: readonly Mantenimiento[] = [
  { id: 1, unidadEquipoId: 1, fecha: '2026-03-10', descripcion: 'Cambio de filtros y aceite hidráulico', costo: 1250.0, tipoMantenimiento: 'PREVENTIVO', activo: true },
  { id: 2, unidadEquipoId: 1, fecha: '2026-06-15', descripcion: 'Revisión de frenos y orugas', costo: 850.0, tipoMantenimiento: 'PREVENTIVO', activo: true },
  { id: 3, unidadEquipoId: 2, fecha: '2026-05-20', descripcion: 'Reparación de bomba hidráulica', costo: 3200.0, tipoMantenimiento: 'CORRECTIVO', activo: true },
  { id: 4, unidadEquipoId: 3, fecha: '2026-07-02', descripcion: 'Ajuste de transmisión principal', costo: 4100.0, tipoMantenimiento: 'CORRECTIVO', activo: false },
  { id: 5, unidadEquipoId: 3, fecha: '2026-07-20', descripcion: 'Revisión del sistema eléctrico', costo: 780.0, tipoMantenimiento: 'CORRECTIVO', activo: true },
];