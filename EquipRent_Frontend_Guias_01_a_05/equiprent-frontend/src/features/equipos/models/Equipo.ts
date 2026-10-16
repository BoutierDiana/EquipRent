/**
 * Contrato que expone el backend en EquipoResponse.
 * No es una entidad JPA: es la forma del JSON que consume el frontend.
 */
export interface Equipo {
  id: number;
  categoriaId: number;
  codigo: string;
  nombre: string;
  marca: string | null;
  modelo: string | null;
  descripcion: string | null;
  activo: boolean;
}
