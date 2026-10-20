export function EmptyState({
                               title,
                               description,
                           }: {
    title: string;
    description?: string;
}) {
    return (
        <div
            role="status"
            style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px dashed #cbd5e1',
                margin: '1rem 0',
            }}
        >
            <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                {title}
            </strong>
            {description && <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{description}</p>}
        </div>
    );
}