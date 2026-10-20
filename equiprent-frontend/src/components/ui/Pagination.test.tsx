import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination Component', () => {
    it('solicita la página siguiente al hacer clic en Siguiente', async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();

        render(<Pagination page={1} totalPages={3} onPageChange={handlePageChange} />);

        const siguienteBtn = screen.getByRole('button', { name: /siguiente/i });
        await user.click(siguienteBtn);

        expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('deshabilita el botón Anterior en la primera página', () => {
        render(<Pagination page={1} totalPages={3} onPageChange={vi.fn()} />);
        const anteriorBtn = screen.getByRole('button', { name: /anterior/i });
        expect(anteriorBtn).toBeDisabled();
    });
});