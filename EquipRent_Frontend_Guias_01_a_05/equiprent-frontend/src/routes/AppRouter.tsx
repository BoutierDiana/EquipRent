import { Route, Routes } from 'react-router';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../pages/DashboardPage';
import AcercaPage from '../pages/AcercaPage';
import NotFoundPage from '../pages/NotFoundPage';
import EquiposPage from '../features/equipos/pages/EquiposPage';
import UnidadesPage from '../features/unidades/pages/UnidadesPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="equipos" element={<EquiposPage />} />
        <Route path="unidades" element={<UnidadesPage />} />
        <Route path="acerca" element={<AcercaPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
