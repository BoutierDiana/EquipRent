import { Button } from './Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirming?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
                                  open,
                                  title,
                                  message,
                                  confirming = false,
                                  onConfirm,
                                  onCancel,
                              }: ConfirmDialogProps) {
    return (
        <Modal open={open} title={title} onClose={onCancel}>
            <p style={{ margin: '0 0 1.5rem 0', color: '#475569', fontSize: '0.95rem' }}>
                {message}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="secondary" onClick={onCancel} disabled={confirming}>
                    Cancelar
                </Button>
                <Button variant="danger" loading={confirming} onClick={onConfirm}>
                    Eliminar
                </Button>
            </div>
        </Modal>
    );
}