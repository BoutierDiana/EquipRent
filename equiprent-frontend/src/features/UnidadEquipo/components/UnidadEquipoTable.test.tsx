import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { unidadesMock } from '../data/unidades.mock';
import UnidadEquipoTable from './UnidadEquipoTable';

describe('UnidadEquipoTable', () => {
    it('muestra una fila por unidad con su serie y estado legible', () => {
        render(<UnidadEquipoTable unidades={unidadesMock} onEdit={vi.fn()} onDelete={vi.fn()} />);

        expect(screen.getAllByRole('row')).toHaveLength(unidadesMock.length + 1); // + encabezado
        const fila = screen.getByText('SN-HON-000301').closest('tr')!;
        expect(within(fila).getByText('En mantenimiento')).toBeInTheDocument();
    });

    it('emite onEdit con el id y onDelete con la unidad', async () => {
        const user = userEvent.setup();
        const onEdit = vi.fn();
        const onDelete = vi.fn();
        render(<UnidadEquipoTable unidades={[unidadesMock[0]]} onEdit={onEdit} onDelete={onDelete} />);

        await user.click(screen.getByRole('button', { name: /editar/i }));
        await user.click(screen.getByRole('button', { name: /eliminar/i }));

        expect(onEdit).toHaveBeenCalledWith(1);
        expect(onDelete).toHaveBeenCalledWith(unidadesMock[0]);
    });

    it('muestra el mensaje de vacío cuando no hay unidades', () => {
        render(<UnidadEquipoTable unidades={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
        expect(screen.getByText('No hay unidades de maquinaria registradas.')).toBeInTheDocument();
    });
});
