import type { UnidadEquipo } from '../models/UnidadEquipo';

export const unidadesMock: UnidadEquipo[] = [
    { id: 1, codigoInventario: 'EQ-001', numeroSerie: 'CAT-988-X1', marca: 'Caterpillar', modelo: '988K', estadoOperativo: 'DISPONIBLE', activo: true },
    { id: 2, codigoInventario: 'EQ-002', numeroSerie: 'KOM-WA-470', marca: 'Komatsu', modelo: 'WA470', estadoOperativo: 'DISPONIBLE', activo: true },
    { id: 3, codigoInventario: 'EQ-003', numeroSerie: 'VOL-A40G', marca: 'Volvo', modelo: 'A40G', estadoOperativo: 'EN_TALLER', activo: false },
    { id: 4, codigoInventario: 'EQ-004', numeroSerie: 'JCB-3CX-PRO', marca: 'JCB', modelo: '3CX', estadoOperativo: 'DISPONIBLE', activo: true },
    // Agregados para la práctica obligatoria:
    { id: 5, codigoInventario: 'EQ-005', numeroSerie: 'HIT-ZX200', marca: 'Hitachi', modelo: 'ZX200', estadoOperativo: 'DISPONIBLE', activo: true },
    { id: 6, codigoInventario: 'EQ-006', numeroSerie: 'LIE-L580', marca: 'Liebherr', modelo: 'L580', estadoOperativo: 'EN_REVISION', activo: false },
];