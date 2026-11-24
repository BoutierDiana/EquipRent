import { describe, expect, it } from 'vitest';
import {
    MANTENIMIENTO_REMOTO_VACIO,
    MENSAJES_MANTENIMIENTO_REMOTO,
    MENSAJES_UNIDAD,
    MENSAJES_UNIDAD_REMOTA,
    UNIDAD_REMOTA_VACIA,
    UNIDAD_VACIA,
    esFechaValida,
    leerCosto,
    normalizarCodigo,
    tieneErrores,
    validarMantenimiento,
    validarMantenimientoRemoto,
    validarUnidad,
    validarUnidadRemota,
    type MantenimientoRemotoFormulario,
    type UnidadFormulario,
    type UnidadRemotaFormulario,
} from '../src/domain/validaciones';
import { UNIDADES } from '../src/data/demoData';

describe('utilidades de validación', () => {
    it('normaliza códigos y series a mayúsculas sin espacios', () => {
        expect(normalizarCodigo('  eq-005 ')).toBe('EQ-005');
    });

    it.each([
        ['2026-03-10', true],
        ['2024-02-29', true], // año bisiesto
        ['2026-02-29', false], // 2026 no es bisiesto
        ['2026-02-31', false],
        ['2026-13-01', false],
        ['10/03/2026', false],
        ['', false],
    ])('esFechaValida(%s) -> %s', (texto, esperado) => {
        expect(esFechaValida(texto)).toBe(esperado);
    });

    it('lee costos con coma o punto y rechaza texto vacío', () => {
        expect(leerCosto('1250,50')).toBe(1250.5);
        expect(leerCosto(' 80.5 ')).toBe(80.5);
        expect(leerCosto('')).toBeNaN();
        expect(leerCosto('abc')).toBeNaN();
    });

    it('tieneErrores distingue objeto vacío de objeto con mensajes', () => {
        expect(tieneErrores({})).toBe(false);
        expect(tieneErrores({ fecha: 'x' })).toBe(true);
    });
});

describe('validarMantenimiento (laboratorio local)', () => {
    const valido = {
        unidadEquipoId: 1,
        tipoMantenimiento: 'PREVENTIVO',
        fecha: '2026-03-10',
        descripcion: 'Cambio de aceite',
        costo: '150',
    };

    it('acepta un formulario correcto', () => {
        expect(validarMantenimiento(valido, [1, 2])).toEqual({});
    });

    it('rechaza una unidad que no existe', () => {
        expect(validarMantenimiento({ ...valido, unidadEquipoId: 99 }, [1, 2]).unidadEquipoId).toBeTruthy();
    });

    it('rechaza costo cero, descripción corta y tipo fuera de catálogo', () => {
        const e = validarMantenimiento(
            { ...valido, costo: '0', descripcion: 'abc', tipoMantenimiento: 'URGENTE' },
            [1]
        );
        expect(Object.keys(e).sort()).toEqual(['costo', 'descripcion', 'tipoMantenimiento']);
    });
});

describe('validarUnidad (laboratorio local)', () => {
    const nueva: UnidadFormulario = {
        ...UNIDAD_VACIA,
        codigoInventario: 'eq-010',
        numeroSerie: 'hyu-r220',
        marca: 'Hyundai',
        modelo: 'R220',
    };

    it('acepta una unidad nueva correcta (normaliza a mayúsculas)', () => {
        expect(validarUnidad(nueva, UNIDADES)).toEqual({});
    });

    it('rechaza el formato de código EQ-000', () => {
        expect(validarUnidad({ ...nueva, codigoInventario: 'EQ10' }, UNIDADES).codigoInventario).toBe(
            MENSAJES_UNIDAD.codigo
        );
    });

    it('rechaza código y serie de OTRA unidad', () => {
        const e = validarUnidad({ ...nueva, codigoInventario: 'EQ-001', numeroSerie: 'kom-wa-470' }, UNIDADES);
        expect(e.codigoInventario).toBe(MENSAJES_UNIDAD.codigoDuplicado);
        expect(e.numeroSerie).toBe(MENSAJES_UNIDAD.serieDuplicada);
    });

    it('al editar, la unidad no choca consigo misma', () => {
        const actual = UNIDADES[0];
        const edicion = { ...nueva, codigoInventario: actual.codigoInventario, numeroSerie: actual.numeroSerie };
        expect(validarUnidad(edicion, UNIDADES, actual.id)).toEqual({});
    });
});

describe('validarUnidadRemota (mismas reglas que @Valid de Spring Boot)', () => {
    const base: UnidadRemotaFormulario = { ...UNIDAD_REMOTA_VACIA, equipoId: 1, numeroSerie: 'MAK-12345' };

    it('acepta datos válidos', () => {
        expect(validarUnidadRemota(base, [1, 2, 3])).toEqual({});
    });

    it('serie entre 5 y 50 caracteres', () => {
        expect(validarUnidadRemota({ ...base, numeroSerie: 'AB12' }, [1]).numeroSerie).toBe(
            MENSAJES_UNIDAD_REMOTA.serie
        );
        expect(validarUnidadRemota({ ...base, numeroSerie: 'X'.repeat(51) }, [1]).numeroSerie).toBeTruthy();
    });

    it('métrica de uso no negativa y equipo del catálogo', () => {
        const e = validarUnidadRemota({ ...base, equipoId: 9, metricaUsoAcumulada: '-1' }, [1, 2, 3]);
        expect(e.equipoId).toBe(MENSAJES_UNIDAD_REMOTA.equipo);
        expect(e.metricaUsoAcumulada).toBe(MENSAJES_UNIDAD_REMOTA.metrica);
    });

    it('rechaza un estado operativo fuera del CHECK de PostgreSQL', () => {
        expect(validarUnidadRemota({ ...base, estadoOperativo: 'EN_TALLER' }, [1]).estadoOperativo).toBeTruthy();
    });
});

describe('validarMantenimientoRemoto (regla egreso >= ingreso)', () => {
    const base: MantenimientoRemotoFormulario = {
        ...MANTENIMIENTO_REMOTO_VACIO,
        unidadEquipoId: 3,
        fechaIngreso: '2026-10-14',
        fechaEgresoEstimada: '2026-10-24',
    };

    it('acepta una orden en proceso sin egreso real', () => {
        expect(validarMantenimientoRemoto(base, [3])).toEqual({});
    });

    it('acepta egreso el MISMO día del ingreso', () => {
        expect(validarMantenimientoRemoto({ ...base, fechaEgresoEstimada: '2026-10-14' }, [3])).toEqual({});
    });

    it('rechaza egreso estimado y real anteriores al ingreso', () => {
        const e = validarMantenimientoRemoto(
            { ...base, fechaEgresoEstimada: '2026-10-13', fechaEgresoReal: '2026-10-01' },
            [3]
        );
        expect(e.fechaEgresoEstimada).toBe(MENSAJES_MANTENIMIENTO_REMOTO.egresoAnterior);
        expect(e.fechaEgresoReal).toBe(MENSAJES_MANTENIMIENTO_REMOTO.egresoAnterior);
    });

    it('rechaza fechas inválidas y unidad inexistente', () => {
        const e = validarMantenimientoRemoto({ ...base, unidadEquipoId: 50, fechaIngreso: '2026-02-30' }, [3]);
        expect(e.unidadEquipoId).toBeTruthy();
        expect(e.fechaIngreso).toBe(MENSAJES_MANTENIMIENTO_REMOTO.fecha);
    });
});
