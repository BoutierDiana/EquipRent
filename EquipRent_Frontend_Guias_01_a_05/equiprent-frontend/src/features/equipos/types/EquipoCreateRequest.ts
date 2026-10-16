/**
 * Coincide con CrearEquipoRequest del backend.
 * No lleva id (lo genera PostgreSQL) ni activo (nace en true).
 */
export interface EquipoCreateRequest {
  categoriaId: number;
  codigo: string;
  nombre: string;
  marca: string | null;
  modelo: string | null;
  descripcion: string | null;
}
