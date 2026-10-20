import { describe, expect, it } from 'vitest';
import { unidadesMock } from '../../UnidadEquipo/data/unidades.mock';
import type { MantenimientoFormData } from '../types/MantenimientoRequests';
import { validarMantenimiento } from './mantenimientoValidation';

const valido: MantenimientoFormData = {
    unidadEquipoId: '3',
    tipo: 'CORRECTIVO',
    estado: 'EN_PROCESO',
    fechaIngreso: '2026-10-14T08:30',
    fechaEgresoEstimada: '2026-10-24T18:00',
    fechaEgresoReal: '',
};

describe('validarMantenimiento', () => {
    it('acepta una orden válida asociada a una unidad existente', () => {
        expect(validarMantenimiento(valido, unidadesMock)).toEqual({});
    });

    it('exige que la unidad padre exista (relación 1:N)', () => {
        expect(validarMantenimiento({ ...valido, unidadEquipoId: '' }, unidadesMock).unidadEquipoId).toMatch(/seleccionar/);
        expect(validarMantenimiento({ ...valido, unidadEquipoId: '999' }, unidadesMock).unidadEquipoId).toMatch(/no existe/);
    });

    it('rechaza un egreso estimado anterior al ingreso', () => {
        const errores = validarMantenimiento({ ...valido, fechaEgresoEstimada: '2026-10-13T08:00' }, unidadesMock);
        expect(errores.fechaEgresoEstimada).toMatch(/anterior al ingreso/);
    });

    it('rechaza tipos que el backend no acepta', () => {
        expect(validarMantenimiento({ ...valido, tipo: 'INSPECCION' }, unidadesMock).tipo).toBeDefined();
    });
});
