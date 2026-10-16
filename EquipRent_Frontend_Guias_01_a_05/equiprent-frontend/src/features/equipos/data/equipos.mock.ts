import type { Equipo } from '../models/Equipo';

/**
 * Datos simulados de la Guía 03. Desde la Guía 05 las páginas consumen el backend;
 * estos mocks quedan como referencia del contrato y para trabajar sin la API.
 */
export const equiposMock: Equipo[] = [
  {
    id: 1,
    categoriaId: 1,
    codigo: 'EQ-TAL-001',
    nombre: 'Taladro percutor 800W',
    marca: 'Bosch',
    modelo: 'GSB 13 RE',
    descripcion: 'Incluye maletín y brocas',
    activo: true,
  },
  {
    id: 2,
    categoriaId: 2,
    codigo: 'EQ-PRO-001',
    nombre: 'Proyector 4000 lúmenes',
    marca: 'Epson',
    modelo: 'PowerLite X49',
    descripcion: null,
    activo: true,
  },
  {
    id: 3,
    categoriaId: 3,
    codigo: 'EQ-GEN-001',
    nombre: 'Generador 5 kVA',
    marca: 'Honda',
    modelo: 'EG5000',
    descripcion: 'Motor a gasolina',
    activo: true,
  },
  {
    id: 4,
    categoriaId: 3,
    codigo: 'EQ-MEZ-001',
    nombre: 'Mezcladora de concreto',
    marca: 'Menegotti',
    modelo: 'MB-150',
    descripcion: null,
    activo: false,
  },
];
