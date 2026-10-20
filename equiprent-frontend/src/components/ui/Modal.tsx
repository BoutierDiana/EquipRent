import { useEffect, useRef, type ReactNode } from 'react';

export interface ModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            onCancel={onClose}
            onClose={onClose}
            style={{
                padding: 0,
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                maxWidth: '500px',
                width: '90%',
            }}
        >
            <div style={{ padding: '1.5rem', background: '#fff' }}>
                <header
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>{title}</h2>
                    <button
                        type="button"
                        aria-label="Cerrar"
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#64748b',
                        }}
                    >
                        ×
                    </button>
                </header>
                {children}
            </div>
        </dialog>
    );
}