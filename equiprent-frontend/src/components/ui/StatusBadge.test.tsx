import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge Component', () => {
    it('muestra el texto Activo cuando active es true', () => {
        render(<StatusBadge active />);
        expect(screen.getByText('Activo')).toBeInTheDocument();
    });

    it('muestra texto personalizado cuando se le pasa la prop text', () => {
        render(<StatusBadge active={false} text="EN_MANTENIMIENTO" />);
        expect(screen.getByText('EN_MANTENIMIENTO')).toBeInTheDocument();
    });
});