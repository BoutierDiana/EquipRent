import { describe, expect, it } from 'vitest';
import { datetimeLocalToIso, isoToDatetimeLocal } from './dates';

describe('conversión datetime-local <-> ISO', () => {
    it('ida y vuelta conserva la hora local que eligió el usuario', () => {
        const local = '2026-10-20T08:15';
        expect(isoToDatetimeLocal(datetimeLocalToIso(local))).toBe(local);
    });

    it('devuelve cadena vacía para valores nulos o inválidos', () => {
        expect(isoToDatetimeLocal(null)).toBe('');
        expect(isoToDatetimeLocal('no-es-fecha')).toBe('');
    });
});
