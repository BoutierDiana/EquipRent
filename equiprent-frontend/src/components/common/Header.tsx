import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/apiClient';
import { isAbortError } from '../../shared/utils/isAbortError';

type NodeStatus = 'checking' | 'online' | 'offline';

const STATUS_LABEL: Record<NodeStatus, string> = {
    checking: 'Verificando nodo',
    online: 'Online Node',
    offline: 'Offline Node',
};

const HEALTH_INTERVAL_MS = 30_000;

export default function Header() {
    const [status, setStatus] = useState<NodeStatus>('checking');

    // Sincroniza el indicador con GET /api/health; el cleanup aborta la petición en curso.
    useEffect(() => {
        let controller = new AbortController();

        const check = async () => {
            controller.abort();
            controller = new AbortController();
            try {
                await apiFetch<{ status: string }>('/health', { signal: controller.signal });
                setStatus('online');
            } catch (err) {
                if (!isAbortError(err)) setStatus('offline');
            }
        };

        void check();
        const intervalId = window.setInterval(() => void check(), HEALTH_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
            controller.abort();
        };
    }, []);

    return (
        <header className="app-header">
            <div className="app-header__title">
                <span className="app-header__kicker">Plataforma de Control de Flota</span>
            </div>

            <div className="app-header__meta">
                <span className={`node-status node-status--${status}`} role="status" aria-live="polite">
                    <span className="node-status__dot" aria-hidden="true" />
                    {STATUS_LABEL[status]}
                </span>
                <span className="session-chip">Sesion activa</span>
            </div>
        </header>
    );
}
