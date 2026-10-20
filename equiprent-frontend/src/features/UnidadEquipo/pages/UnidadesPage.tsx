import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import UnidadEquipoForm from '../components/UnidadEquipoForm';
import UnidadEquipoTable from '../components/UnidadEquipoTable';
import { useUnidadesEquipo } from '../hooks/useUnidadesEquipo';
import type { UnidadEquipo } from '../models/UnidadEquipo';
import { unidadEquipoService } from '../services/unidadEquipoService';

const PAGE_SIZE_OPTIONS = [
    { value: '5', label: '5 por página' },
    { value: '10', label: '10 por página' },
    { value: '20', label: '20 por página' },
];

const ESTADO_OPTIONS = [
    { value: 'ALL', label: 'Todos los estados' },
    { value: 'DISPONIBLE', label: 'Disponible' },
    { value: 'ALQUILADO', label: 'Alquilado' },
    { value: 'EN_MANTENIMIENTO', label: 'En Mantenimiento' },
    { value: 'BAJA', label: 'Baja' },
];

export default function UnidadesPage() {
    const {
        data: unidades,
        setData: setUnidades,
        loading,
        error,
        setError,
    } = useUnidadesEquipo();

    // Estados de control de UI y filtros (Single Source of Truth)
    const [search, setSearch] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Estados de edición y eliminación
    const [editingUnidad, setEditingUnidad] = useState<UnidadEquipo | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<UnidadEquipo | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const notifySuccess = (msg: string) => {
        setSuccessMessage(msg);
        window.setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Regla Guía 09: Reiniciar a la página 1 cuando cambia la búsqueda, filtro o tamaño
    useEffect(() => {
        setPage(1);
    }, [search, estadoFilter, pageSize]);

    // Dato derivado: Filtro compuesto (Búsqueda textual AND Estado)
    const filteredUnidades = useMemo(() => {
        const term = search.trim().toLowerCase();
        return unidades.filter((u: any) => {
            const matchText =
                !term ||
                String(u.codigoInventario ?? '').toLowerCase().includes(term) ||
                String(u.numeroSerie ?? '').toLowerCase().includes(term) ||
                String(u.marca ?? '').toLowerCase().includes(term) ||
                String(u.modelo ?? '').toLowerCase().includes(term) ||
                String(u.ubicacionActual ?? '').toLowerCase().includes(term);

            const matchEstado =
                estadoFilter === 'ALL' ||
                String(u.estadoOperativo ?? '').toUpperCase() === estadoFilter;

            return matchText && matchEstado;
        });
    }, [unidades, search, estadoFilter]);

    // Dato derivado: Paginación cliente
    const totalPages = Math.max(1, Math.ceil(filteredUnidades.length / pageSize));
    const start = (page - 1) * pageSize;
    const visibleUnidades = filteredUnidades.slice(start, start + pageSize);

    const handleEdit = async (id: number) => {
        try {
            setLoadingDetail(true);
            setError('');
            const unidad = await unidadEquipoService.obtenerPorId(id);
            setEditingUnidad(unidad);
            setMostrarFormulario(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo cargar la unidad para edición',
            );
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleSaved = (saved: UnidadEquipo, mode: 'create' | 'edit') => {
        setUnidades((prev) =>
            mode === 'create'
                ? [...prev, saved]
                : prev.map((item) => (item.id === saved.id ? saved : item)),
        );
        setEditingUnidad(null);
        setMostrarFormulario(false);
        notifySuccess(
            mode === 'create'
                ? 'Unidad creada con éxito.'
                : 'Unidad actualizada con éxito.',
        );
    };

    // ConfirmDialog handler: Reemplaza a window.confirm()
    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        const targetId = pendingDelete.id ?? (pendingDelete as any).unidadEquipoId;
        if (!targetId) return;

        try {
            setIsDeleting(true);
            setError('');
            await unidadEquipoService.eliminar(targetId);
            setUnidades((prev) =>
                prev.filter(
                    (item) => (item.id ?? (item as any).unidadEquipoId) !== targetId,
                ),
            );
            if (
                (editingUnidad?.id ?? (editingUnidad as any)?.unidadEquipoId) ===
                targetId
            ) {
                setEditingUnidad(null);
                setMostrarFormulario(false);
            }
            notifySuccess('Unidad eliminada correctamente.');
            setPendingDelete(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo eliminar la unidad. Verifique que no posea registros dependientes.',
            );
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="feature-page page-stack">
            <div
                className="page-heading"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                }}
            >
                <div>
                    <p className="eyebrow">FLOTA Y MAQUINARIA</p>
                    <h1>Unidades de Maquinaria</h1>
                    <p>Inventario de equipos físicos con búsqueda, filtros y paginación.</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingUnidad(null);
                        setMostrarFormulario((prev) => !prev);
                    }}
                >
                    {mostrarFormulario ? 'Cerrar Formulario' : '+ Nueva Unidad'}
                </Button>
            </div>

            {successMessage && (
                <div
                    style={{
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                    }}
                >
                    {successMessage}
                </div>
            )}

            {error && (
                <div
                    className="state-card error"
                    style={{
                        padding: '1rem',
                        background: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                    }}
                >
                    {error}
                </div>
            )}

            {loadingDetail && (
                <div
                    className="state-card"
                    style={{
                        padding: '0.8rem',
                        background: '#e0f2fe',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                    }}
                >
                    Cargando detalle de la maquinaria seleccionada...
                </div>
            )}

            {mostrarFormulario && (
                <UnidadEquipoForm
                    unidad={editingUnidad}
                    onSaved={handleSaved}
                    onCancelEdit={() => {
                        setEditingUnidad(null);
                        setMostrarFormulario(false);
                    }}
                />
            )}

            {/* Barra de Búsqueda y Filtros Combinados */}
            <div
                style={{
                    background: '#ffffff',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    alignItems: 'flex-end',
                    marginBottom: '1rem',
                }}
            >
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Código, serie, marca, modelo..."
                    label="Buscar Maquinaria"
                />

                <SelectFilter
                    label="Estado Operativo"
                    value={estadoFilter}
                    options={ESTADO_OPTIONS}
                    onChange={setEstadoFilter}
                />

                <SelectFilter
                    label="Registros por página"
                    value={String(pageSize)}
                    options={PAGE_SIZE_OPTIONS}
                    onChange={(val) => setPageSize(Number(val))}
                />
            </div>

            {loading ? (
                <div
                    className="state-card"
                    style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                    }}
                >
                    Cargando unidades...
                </div>
            ) : filteredUnidades.length === 0 ? (
                <EmptyState
                    title="No se encontraron maquinarias"
                    description="Intente ajustando el término de búsqueda o cambiando el filtro de estado."
                />
            ) : (
                <>
                    <UnidadEquipoTable
                        unidades={visibleUnidades}
                        onEdit={handleEdit}
                        onDelete={(u) => setPendingDelete(u)}
                        deletingId={isDeleting ? (pendingDelete?.id ?? null) : null}
                    />

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            {/* Modal accesible para confirmar eliminación */}
            <ConfirmDialog
                open={Boolean(pendingDelete)}
                title="Eliminar Maquinaria"
                message={`¿Está seguro de que desea eliminar la unidad ${pendingDelete?.codigoInventario ?? ''}? Esta acción no se puede deshacer.`}
                confirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </section>
    );
}