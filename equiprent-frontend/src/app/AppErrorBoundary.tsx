import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; errorMessage: string };

/**
 * Captura errores de RENDER de React (Guía 10). No reemplaza el try/catch de fetch:
 * los errores asíncronos y de event handlers se manejan en hooks y páginas.
 */
export class AppErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false, errorMessage: '' };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error.message };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('Render error capturado por ErrorBoundary:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main role="alert" className="error-boundary bg-cyber-grid">
                    <div className="error-boundary__card">
                        <p className="eyebrow">Fallo de renderizado</p>
                        <h1>La interfaz tuvo un problema</h1>
                        <p>Ocurrió un error inesperado al renderizar este componente.</p>
                        {this.state.errorMessage && (
                            <pre className="error-boundary__detail">{this.state.errorMessage}</pre>
                        )}
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => window.location.assign('/')}
                        >
                            Volver al inicio
                        </button>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}
