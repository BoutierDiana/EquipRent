# EquipRent - Frontend Base

Estructura inicial basada en React, TypeScript y Vite organizada por módulos y responsabilidades.

## Propósito de 5 Carpetas Principales

1. **`src/app/`**: Inicialización del componente raíz (`App.tsx`) que compone la vista principal de la aplicación.
2. **`src/features/`**: Agrupa los módulos de negocio del sistema (`unidades`, `mantenimientos`), aislando sus componentes, páginas, tipos y llamadas a servicios.
3. **`src/components/common/`**: Contiene componentes genéricos y reutilizables en múltiples pantallas (botones, campos de texto, tablas, modales).
4. **`src/services/http/`**: Centraliza el cliente HTTP y la configuración base para realizar peticiones REST hacia el backend Spring Boot.
5. **`src/types/`**: Contiene interfaces y definiciones de tipos globales de TypeScript compartidos por toda la aplicación.