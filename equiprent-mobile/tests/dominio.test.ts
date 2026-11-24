import { describe, expect, it } from 'vitest';
import { MANTENIMIENTOS, UNIDADES } from '../src/data/demoData';
import {
    codigoOcupado,
    costoTotalActivo,
    mantenimientosDe,
    puedeEliminarUnidad,
    serieOcupada,
    unidadExiste,
} from '../src/domain/equiprentRules';
import { equiprentReducer, estadoInicial, siguienteId } from '../src/state/equiprentReducer';
import type { Mantenimiento, UnidadEquipo } from '../src/models/equiprent';

describe('relación 1:N UnidadEquipo -> Mantenimiento', () => {
    it('la unidad 1 tiene dos órdenes y la 4 ninguna', () => {
        expect(mantenimientosDe(1, MANTENIMIENTOS)).toHaveLength(2);
        expect(mantenimientosDe(4, MANTENIMIENTOS)).toHaveLength(0);
    });

    it('solo se elimina una unidad sin mantenimientos', () => {
        expect(puedeEliminarUnidad(1, MANTENIMIENTOS)).toBe(false);
        expect(puedeEliminarUnidad(4, MANTENIMIENTOS)).toBe(true);
    });

    it('la clave foránea debe apuntar a una unidad existente', () => {
        expect(unidadExiste(3, UNIDADES)).toBe(true);
        expect(unidadExiste(88, UNIDADES)).toBe(false);
    });

    it('detecta código y serie ocupados, excepto por la propia unidad', () => {
        expect(codigoOcupado('EQ-001', UNIDADES)).toBe(true);
        expect(codigoOcupado('EQ-001', UNIDADES, 1)).toBe(false);
        expect(serieOcupada('VOL-A40G', UNIDADES)).toBe(true);
        expect(serieOcupada('NO-EXISTE', UNIDADES)).toBe(false);
    });

    it('el costo total ignora órdenes inactivas', () => {
        // 1250 + 850 + 3200 + 780 (la orden 4 de 4100 está inactiva)
        expect(costoTotalActivo(MANTENIMIENTOS)).toBe(6080);
    });

    it('siguienteId es el mayor + 1, y 1 con lista vacía', () => {
        expect(siguienteId(UNIDADES)).toBe(5);
        expect(siguienteId([])).toBe(1);
    });
});

describe('equiprentReducer (puro e inmutable)', () => {
    const unidadNueva: UnidadEquipo = {
        id: 5,
        codigoInventario: 'EQ-005',
        numeroSerie: 'HYU-R220',
        marca: 'Hyundai',
        modelo: 'R220',
        estadoOperativo: 'DISPONIBLE',
        activo: true,
    };
    const ordenNueva: Mantenimiento = {
        id: 6,
        unidadEquipoId: 4,
        fecha: '2026-08-01',
        descripcion: 'Engrase general',
        costo: 300,
        tipoMantenimiento: 'PREVENTIVO',
        activo: true,
    };

    it('no permite eliminar una unidad con mantenimientos (devuelve el MISMO estado)', () => {
        const estado = equiprentReducer(estadoInicial, { type: 'UNIDAD_ELIMINAR', id: 1 });
        expect(estado).toBe(estadoInicial);
    });

    it('elimina una unidad sin hijos sin mutar el estado anterior', () => {
        const estado = equiprentReducer(estadoInicial, { type: 'UNIDAD_ELIMINAR', id: 4 });
        expect(estado.unidades).toHaveLength(3);
        expect(estadoInicial.unidades).toHaveLength(4);
    });

    it('crea una unidad nueva y rechaza un código duplicado', () => {
        expect(equiprentReducer(estadoInicial, { type: 'UNIDAD_CREAR', payload: unidadNueva }).unidades).toHaveLength(5);
        const duplicada = { ...unidadNueva, codigoInventario: 'EQ-002' };
        expect(equiprentReducer(estadoInicial, { type: 'UNIDAD_CREAR', payload: duplicada })).toBe(estadoInicial);
    });

    it('edita una unidad conservando las demás', () => {
        const editada = { ...UNIDADES[1], estadoOperativo: 'EN_USO' };
        const estado = equiprentReducer(estadoInicial, { type: 'UNIDAD_EDITAR', payload: editada });
        expect(estado.unidades.find((u) => u.id === 2)?.estadoOperativo).toBe('EN_USO');
        expect(estado.unidades).toHaveLength(4);
    });

    it('crea un mantenimiento solo si la unidad existe', () => {
        expect(
            equiprentReducer(estadoInicial, { type: 'MANTENIMIENTO_CREAR', payload: ordenNueva }).mantenimientos
        ).toHaveLength(6);
        const huerfana = { ...ordenNueva, unidadEquipoId: 99 };
        expect(equiprentReducer(estadoInicial, { type: 'MANTENIMIENTO_CREAR', payload: huerfana })).toBe(
            estadoInicial
        );
    });

    it('tras borrar sus órdenes, la unidad ya se puede eliminar', () => {
        let estado = equiprentReducer(estadoInicial, { type: 'MANTENIMIENTO_ELIMINAR', id: 1 });
        estado = equiprentReducer(estado, { type: 'MANTENIMIENTO_ELIMINAR', id: 2 });
        estado = equiprentReducer(estado, { type: 'UNIDAD_ELIMINAR', id: 1 });
        expect(estado.unidades.map((u) => u.id)).toEqual([2, 3, 4]);
    });
});
