import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput Component', () => {
    it('emite el valor digitado por el usuario', async () => {
        const user = userEvent.setup();
        const handleChange = vi.fn();

        render(<SearchInput value="" onChange={handleChange} placeholder="Buscar equipo..." />);

        const input = screen.getByPlaceholderText('Buscar equipo...');
        await user.type(input, 'CAT');

        expect(handleChange).toHaveBeenCalled();
    });
});