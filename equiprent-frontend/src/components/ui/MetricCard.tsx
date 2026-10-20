import type { CSSProperties } from 'react';

export interface MetricCardProps {
    label: string;
    value: number;
    helper?: string;
    color?: string;
}

/** Tarjeta de métrica derivada (Guía 10). color define el acento del borde y del valor. */
export function MetricCard({ label, value, helper, color = 'var(--color-lime)' }: MetricCardProps) {
    const style = { '--metric-accent': color } as CSSProperties;

    return (
        <article className="metric-card" style={style}>
            <span className="metric-card__label">{label}</span>
            <strong className="metric-card__value">{value}</strong>
            {helper && <small className="metric-card__helper">{helper}</small>}
        </article>
    );
}
