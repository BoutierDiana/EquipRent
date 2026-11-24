// Catálogo de EQUIPOS (lado "modelo" de una UnidadEquipo).
// Copia de los registros del seed V2__seed_core.sql del backend: el backend
// todavía no expone GET /api/equipos, por eso el móvil los conoce de antemano.
// Si el profesor agrega ese endpoint, este archivo se reemplaza por una consulta HTTP.

export type EquipoCatalogo = Readonly<{ id: number; codigoModelo: string; nombre: string; marca: string }>;

export const EQUIPOS_CATALOGO: readonly EquipoCatalogo[] = [
    { id: 1, codigoModelo: 'EQ-AMO-002', nombre: 'Amoladora angular 7"', marca: 'Makita' },
    { id: 2, codigoModelo: 'EQ-AND-001', nombre: 'Módulo de andamio 2m', marca: 'Layher' },
    { id: 3, codigoModelo: 'EQ-GEN-001', nombre: 'Generador 5.5kW', marca: 'Honda' },
];

/** "Makita · Amoladora angular 7"" o "Equipo #9" si el id no está en el catálogo local. */
export function nombreEquipo(equipoId: number): string {
    const equipo = EQUIPOS_CATALOGO.find((e) => e.id === equipoId);
    return equipo ? `${equipo.marca} · ${equipo.nombre}` : `Equipo #${equipoId}`;
}
