export type BadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface StatusBadgeProps {
    active: boolean;
    text?: string;
    /** Tono visual opcional; si se omite se deriva de active. El texto siempre acompaña al color. */
    tone?: BadgeTone;
}

export function StatusBadge({ active, text, tone }: StatusBadgeProps) {
    const displayText = text ?? (active ? 'Activo' : 'Inactivo');
    const resolvedTone: BadgeTone = tone ?? (active ? 'success' : 'danger');

    return <span className={`badge badge--${resolvedTone}`}>{displayText}</span>;
}
