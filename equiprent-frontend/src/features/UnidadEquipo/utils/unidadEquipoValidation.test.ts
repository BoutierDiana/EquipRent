import { describe, expect, it } from 'vitest';
import type { UnidadEquipoFormData } from '../types/UnidadEquipoFormData';
import { validarUnidadEquipo } from './unidadEquipoValidation';

const valido: UnidadEquipoFormData = {
    equipoId: '1',
    numeroSerie: 'SN-MAK-000124',
    estadoOperativo: 'DISPONIBLE',
    metricaUsoAcumulada: '12.5',
    notasEstado: '',
    activo: true,
};

describe('validarUnidadEquipo', () => {
    it('no devuelve errores para un formulario válido', () => {
        expect(validarUnidadEquipo(valido)).toEqual({});
    });

    it('exige un número de serie de 5 a 50 caracteres', () => {
        expect(validarUnidadEquipo({ ...valido, numeroSerie: 'SN1' }).numeroSerie).toMatch(/entre 5 y 50/);
        expect(validarUnidadEquipo({ ...valido, numeroSerie: '   ' }).numeroSerie).toMatch(/obligatorio/);
    });

    it('rechaza estados fuera del catálogo oficial', () => {
        expect(validarUnidadEquipo({ ...valido, estadoOperativo: 'ALQUILADO' }).estadoOperativo).toBeDefined();
    });

    it('rechaza métrica negativa y equipoId no entero', () => {
        const errores = validarUnidadEquipo({ ...valido, metricaUsoAcumulada: '-1', equipoId: '1.5' });
        expect(errores.metricaUsoAcumulada).toBeDefined();
        expect(errores.equipoId).toBeDefined();
    });
});
