/** "2026-03-10T08:00:00-04:00" -> "2026-03-10" (se muestra solo la fecha). */
export function formatearFecha(iso: string | null): string {
    if (!iso) return '—';
    return iso.slice(0, 10);
}

/** "EN_MANTENIMIENTO" -> "EN MANTENIMIENTO" (solo presentación, no cambia el dato). */
export function formatearCatalogo(valor: string): string {
    return valor.replace(/_/g, ' ');
}

/** "2026-03-10" -> "2026-03-10T08:00:00-04:00" (OffsetDateTime que espera Spring Boot). */
export function aOffsetDateTime(fecha: string, hora = '08:00:00'): string {
    return `${fecha}T${hora}-04:00`;
}