import { useEffect, useRef, type ReactNode } from 'react';
import { Icon } from './Icon';

export interface ModalProps {
    open: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
}

/**
 * Modal sobre <dialog> nativo: showModal() lo coloca en la capa superior,
 * bloquea el fondo y permite cerrar con Escape (onCancel).
 */
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
        <dialog ref={dialogRef} className="modal" onCancel={onClose} onClose={onClose}>
            <div className="modal__body">
                <header className="modal__header">
                    <h2>{title}</h2>
                    <button type="button" className="modal__close" aria-label="Cerrar" onClick={onClose}>
                        <Icon name="close" size={18} />
                    </button>
                </header>
                {children}
            </div>
        </dialog>
    );
}
