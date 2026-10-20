import { Button } from './Button';
import { Icon } from './Icon';

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const safeTotal = Math.max(1, totalPages);

    return (
        <nav aria-label="Paginación" className="pagination">
            <Button variant="ghost" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                <Icon name="chevron-left" size={16} />
                Anterior
            </Button>

            <span className="pagination__status">
                Página <strong>{page}</strong> de <strong>{safeTotal}</strong>
            </span>

            <Button variant="ghost" disabled={page >= safeTotal} onClick={() => onPageChange(page + 1)}>
                Siguiente
                <Icon name="chevron-right" size={16} />
            </Button>
        </nav>
    );
}
