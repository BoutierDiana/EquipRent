import { describe, expect, it, vi } from 'vitest';

// Los mappers viven junto al cliente HTTP, que importa SecureStore (nativo).
// En Node se reemplaza por un doble de prueba: aquí no hay Android.
vi.mock('expo-secure-store', () => ({
    getItemAsync: vi.fn(async () => null),
    setItemAsync: vi.fn(),
    deleteItemAsync: vi.fn(),
}));

import { aActualizarRequest, aFormulario, type UnidadEquipoDto } from '../src/infra/http/unidadesApi';
import {
    aFormularioMantenimiento,
    aMantenimientoRequest,
    type MantenimientoDto,
} from '../src/infra/http/mantenimientosApi';
import { mismaVersion } from '../src/offline/conflictos';
import { aOffsetDateTime, formatearCatalogo, formatearFecha } from '../src/utils/formato';
import { leerIdPositivo } from '../src/utils/routeParams';

const UNIDAD: UnidadEquipoDto = {
    id: 7,
    equipoId: 2,
    numeroSerie: 'LAY-00077',
    estadoOperativo: 'DISPONIBLE',
    metricaUsoAcumulada: 12.5,
    notasEstado: null,
    activo: true,
    createdAt: '2026-10-01T12:00:00Z',
};

describe('mapper de UnidadEquipo (formulario <-> contrato de Spring Boot)', () => {
    it('normaliza la serie, convierte la métrica y manda null en notas vacías', () => {
        const cuerpo = aActualizarRequest({
            equipoId: 2,
            numeroSerie: ' lay-00077 ',
            estadoOperativo: 'EN_USO',
            metricaUsoAcumulada: '12,5',
            notasEstado: '   ',
            activo: false,
        });
        expect(cuerpo).toEqual({
            equipoId: 2,
            numeroSerie: 'LAY-00077',
            estadoOperativo: 'EN_USO',
            metricaUsoAcumulada: 12.5,
            notasEstado: null,
            activo: false,
        });
    });

    it('ida y vuelta: DTO -> formulario -> request conserva los datos', () => {
        const { id, createdAt, ...editables } = UNIDAD;
        expect(aActualizarRequest(aFormulario(UNIDAD))).toEqual(editables);
        expect(id).toBe(7);
        expect(createdAt).toBeTruthy();
    });
});

describe('mapper de Mantenimiento (fechas OffsetDateTime de Bolivia, -04:00)', () => {
    it('ingreso a las 08:00 y egresos a las 18:00; egreso real vacío -> null', () => {
        const cuerpo = aMantenimientoRequest({
            unidadEquipoId: 3,
            tipo: 'CORRECTIVO',
            fechaIngreso: '2026-10-14',
            fechaEgresoEstimada: '2026-10-24',
            fechaEgresoReal: '',
            estado: 'EN_PROCESO',
        });
        expect(cuerpo.fechaIngreso).toBe('2026-10-14T08:00:00-04:00');
        expect(cuerpo.fechaEgresoEstimada).toBe('2026-10-24T18:00:00-04:00');
        expect(cuerpo.fechaEgresoReal).toBeNull();
        expect(cuerpo.danoId).toBeNull();
    });

    it('el backend devuelve UTC y el formulario muestra el MISMO día', () => {
        // 18:00 -04:00 = 22:00 Z del mismo día: slice(0,10) no cambia la fecha.
        const dto = {
            id: 1,
            unidadEquipoId: 3,
            tipo: 'CORRECTIVO',
            estado: 'COMPLETADO',
            fechaIngreso: '2026-10-14T12:00:00Z',
            fechaEgresoEstimada: '2026-10-24T22:00:00Z',
            fechaEgresoReal: '2026-10-23T22:00:00Z',
        } as unknown as MantenimientoDto;
        expect(aFormularioMantenimiento(dto)).toMatchObject({
            fechaIngreso: '2026-10-14',
            fechaEgresoEstimada: '2026-10-24',
            fechaEgresoReal: '2026-10-23',
        });
    });
});

describe('utilidades de presentación y rutas', () => {
    it.each([
        ['1', 1],
        ['999', 999],
        ['0', null],
        ['-3', null],
        ['abc', null],
        ['1.5', null],
        ['99999999999999999999', null],
        [undefined, null],
    ])('leerIdPositivo(%s) -> %s', (valor, esperado) => {
        expect(leerIdPositivo(valor)).toBe(esperado);
    });

    it('rechaza un parámetro repetido (arreglo)', () => {
        expect(leerIdPositivo(['1', '2'])).toBeNull();
    });

    it('formatea fechas y catálogos sin alterar el dato', () => {
        expect(formatearFecha('2026-03-10T08:00:00-04:00')).toBe('2026-03-10');
        expect(formatearFecha(null)).toBe('—');
        expect(formatearCatalogo('EN_MANTENIMIENTO')).toBe('EN MANTENIMIENTO');
        expect(aOffsetDateTime('2026-03-10')).toBe('2026-03-10T08:00:00-04:00');
    });
});

describe('detección de conflictos offline (Guía 12)', () => {
    it('misma unidad -> sin conflicto, aunque la métrica llegue como texto numérico', () => {
        expect(mismaVersion(UNIDAD, { ...UNIDAD })).toBe(true);
        expect(mismaVersion(UNIDAD, { ...UNIDAD, metricaUsoAcumulada: '12.50' as unknown as number })).toBe(true);
    });

    it('null y cadena vacía en notas se consideran iguales', () => {
        expect(mismaVersion(UNIDAD, { ...UNIDAD, notasEstado: '' })).toBe(true);
    });

    it.each([
        ['estadoOperativo', 'EN_USO'],
        ['numeroSerie', 'LAY-00078'],
        ['metricaUsoAcumulada', 13],
        ['notasEstado', 'Golpe en la base'],
        ['activo', false],
        ['equipoId', 3],
    ])('un cambio en %s en el servidor es conflicto', (campo, valor) => {
        expect(mismaVersion(UNIDAD, { ...UNIDAD, [campo]: valor })).toBe(false);
    });
});
