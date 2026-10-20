import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; errorMessage: string };

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
                <main
                    role="alert"
                    style={{
                        padding: '2.5rem',
                        margin: '2rem auto',
                        maxWidth: '600px',
                        textAlign: 'center',
                        background: '#ffffff',
                        borderRadius: '8px',
                        border: '1px solid #fee2e2',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                >
                    <h1 style={{ color: '#991b1b', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                        La interfaz tuvo un problema
                    </h1>
                    <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Ocurrió un error inesperado al renderizar este componente.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.assign('/')}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            background: '#2563eb',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        Volver al inicio
                    </button>
                </main>
            );
        }

        return this.props.children;
    }
}