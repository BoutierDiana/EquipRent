import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './app/App';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import './styles/tokens.css'; // Design tokens Cyber-Industrial (colores, tipografía, sombras)
import './index.css'; // Base y layout de la aplicación
import './styles/ui.css'; // Componentes: botones, tablas, formularios, modales

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AppErrorBoundary>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AppErrorBoundary>
    </StrictMode>
);
