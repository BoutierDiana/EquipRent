export interface MetricCardProps {
    label: string;
    value: number;
    helper?: string;
    color?: string;
}

export function MetricCard({ label, value, helper, color = '#8b5cf6' }: MetricCardProps) {
    return (
        <article
            style={{
                background: '#19122b',
                padding: '1.4rem',
                borderRadius: '10px',
                border: '1px solid #362956',
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
            }}
        >
      <span style={{ fontSize: '0.82rem', color: '#a78bfa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </span>
            <strong style={{ fontSize: '2.2rem', color: '#ffffff', fontWeight: 700 }}>
                {value}
            </strong>
            {helper && <small style={{ color: '#8b7ca8', fontSize: '0.8rem' }}>{helper}</small>}
        </article>
    );
}