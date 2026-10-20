import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MetricCard } from './MetricCard';

describe('MetricCard Component', () => {
    it('renderiza la etiqueta y el valor numérico correctamente', () => {
        render(<MetricCard label="Disponibles" value={14} helper="Equipos listos" />);

        expect(screen.getByText('Disponibles')).toBeInTheDocument();
        expect(screen.getByText('14')).toBeInTheDocument();
        expect(screen.getByText('Equipos listos')).toBeInTheDocument();
    });
});