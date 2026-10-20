import type { Mantenimiento } from '../models/Mantenimiento';

export const mantenimientosMock: Mantenimiento[] = [
    { id: 1, unidadEquipoId: 1, fecha: '2026-03-10', descripcion: 'Cambio de filtros y aceite hidráulico', costo: 1250.0, tipoMantenimiento: 'PREVENTIVO', activo: true },
    { id: 2, unidadEquipoId: 1, fecha: '2026-06-15', descripcion: 'Revisión de frenos y orugas', costo: 850.0, tipoMantenimiento: 'PREVENTIVO', activo: true },
    { id: 3, unidadEquipoId: 2, fecha: '2026-05-20', descripcion: 'Reparación de bomba hidráulica', costo: 3200.0, tipoMantenimiento: 'CORRECTIVO', activo: true },
    { id: 4, unidadEquipoId: 3, fecha: '2026-07-02', descripcion: 'Ajuste de transmisión principal', costo: 4100.0, tipoMantenimiento: 'CORRECTIVO', activo: false },
    // Casos para la práctica obligatoria:
    { id: 5, unidadEquipoId: 4, fecha: '2026-08-11', descripcion: 'Mantenimiento de 500 horas', costo: 600.0, tipoMantenimiento: 'PREVENTIVO', activo: true },
    { id: 6, unidadEquipoId: 5, fecha: '2026-09-01', descripcion: 'Cambio de mangueras de alta presión', costo: 950.0, tipoMantenimiento: 'CORRECTIVO', activo: true },
    // Registro con ID 999 para probar el caso de "Sin unidad asociada"
    { id: 7, unidadEquipoId: 999, fecha: '2026-09-18', descripcion: 'Revisión técnica extraordinaria', costo: 450.0, tipoMantenimiento: 'PREVENTIVO', activo: true },
];