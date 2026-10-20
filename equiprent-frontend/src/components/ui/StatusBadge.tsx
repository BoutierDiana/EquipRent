export function StatusBadge({ active, text }: { active: boolean; text?: string }) {
    const displayText = text ?? (active ? 'Activo' : 'Inactivo');
    return (
        <span
            style={{
                padding: '3px 10px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 600,
                background: active ? '#dcfce7' : '#fee2e2',
                color: active ? '#15803d' : '#991b1b',
            }}
        >
      {displayText}
    </span>
    );
}