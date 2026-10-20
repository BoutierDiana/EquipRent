import { Button } from './Button';

export interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const safeTotal = Math.max(1, totalPages);

    return (
        <nav
            aria-label="Paginación"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e2e8f0',
            }}
        >
            <Button
                variant="ghost"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Anterior
            </Button>

            <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
        Página <strong>{page}</strong> de <strong>{safeTotal}</strong>
      </span>

            <Button
                variant="ghost"
                disabled={page >= safeTotal}
                onClick={() => onPageChange(page + 1)}
            >
                Siguiente
            </Button>
        </nav>
    );
}