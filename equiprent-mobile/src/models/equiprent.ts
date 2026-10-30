// Un modelo describe la FORMA de los datos: no guarda registros reales.
// Los nombres de campos son los mismos del frontend web de EquipRent.

export type UnidadEquipo = Readonly<{
  id: number;
  codigoInventario: string;
  numeroSerie: string;
  marca: string;
  modelo: string;
  estadoOperativo: string;
  activo: boolean;
}>;

export type Mantenimiento = Readonly<{
  id: number;
  unidadEquipoId: number; // Vínculo lógico 1:N con UnidadEquipo.id
  fecha: string;
  descripcion: string;
  costo: number;
  tipoMantenimiento: string;
  activo: boolean;
}>;

// Unión literal: la sección visible solo puede tomar uno de estos dos valores.
export type Seccion = 'unidades' | 'mantenimientos';