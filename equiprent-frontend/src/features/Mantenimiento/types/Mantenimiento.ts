// El contrato vive en models/Mantenimiento.ts; este archivo lo reexporta
// para no romper los imports existentes desde types/.
export type { Mantenimiento, TipoMantenimiento, EstadoMantenimiento } from '../models/Mantenimiento';
