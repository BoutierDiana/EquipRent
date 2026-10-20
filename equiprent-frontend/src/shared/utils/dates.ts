/**
 * Conversión entre el formato de <input type="datetime-local"> (hora local, sin zona)
 * y el ISO-8601 con zona que espera el backend (OffsetDateTime).
 * Antes se usaba iso.slice(0, 16), que mostraba la hora UTC como si fuera local
 * y podía dejar el egreso antes que el ingreso.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/** ISO del backend -> valor para datetime-local en la hora local del navegador. */
export function isoToDatetimeLocal(iso: string | null | undefined): string {
    if (!iso) return '';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Valor de datetime-local -> ISO-8601 (UTC "Z"), que Spring convierte a OffsetDateTime. */
export function datetimeLocalToIso(local: string): string {
    return new Date(local).toISOString();
}

/** Fecha y hora legibles para tablas (es-BO). */
export function formatDateTime(iso: string | null | undefined): string {
    if (!iso) return '—';
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });
}

/** Valor actual para precargar un datetime-local. */
export function nowDatetimeLocal(): string {
    return isoToDatetimeLocal(new Date().toISOString());
}
