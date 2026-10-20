import { Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import AcercaPage from '../pages/AcercaPage';

// Corrige estas dos líneas:
import UnidadesPage from '../features/UnidadEquipo/pages/UnidadesPage';
import MantenimientosPage from '../features/Mantenimiento/pages/MantenimientosPage';

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="unidades" element={<UnidadesPage />} />
                <Route path="mantenimientos" element={<MantenimientosPage />} />
                <Route path="acerca" element={<AcercaPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}