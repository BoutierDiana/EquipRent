import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Icon } from '../../../components/ui/Icon';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import UnidadEquipoForm from '../components/UnidadEquipoForm';
import UnidadEquipoTable from '../components/UnidadEquipoTable';
import { useUnidadesEquipo } from '../hooks/useUnidadesEquipo';
import { ESTADOS_OPERATIVOS, type UnidadEquipo } from '../models/UnidadEquipo';
import { unidadEquipoService } from '../services/unidadEquipoService';
import { estadoOperativoLabel } from '../utils/unidadEquipoFormat';

const PAGE_SIZE_OPTIONS = [
    { value: '5', label: '5 por página' },
    { value: '10', label: '10 por página' },
    { value: '20', label: '20 por página' },
];

const ESTADO_OPTIONS = [
    { value: 'ALL', label: 'Todos los estados' },
    ...ESTADOS_OPERATIVOS.map((estado) => ({ value: estado, label: estadoOperativoLabel(estado) })),
];

const VIGENCIA_OPTIONS = [
    { value: 'ALL', label: 'Todas' },
    { value: 'ACTIVE', label: 'Solo vigentes' },
    { value: 'INACTIVE', label: 'Solo no vigentes' },
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
    const [vigenciaFilter, setVigenciaFilter] = useState('ALL');
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
    }, [search, estadoFilter, vigenciaFilter, pageSize]);

    // Dato derivado: Filtro compuesto (Búsqueda textual AND Estado AND Vigencia)
    const filteredUnidades = useMemo(() => {
        const term = search.trim().toLowerCase();
        return unidades.filter((u) => {
            const matchText =
                !term ||
                u.numeroSerie.toLowerCase().includes(term) ||
                String(u.id).includes(term) ||
                String(u.equipoId).includes(term) ||
                (u.notasEstado ?? '').toLowerCase().includes(term) ||
                estadoOperativoLabel(u.estadoOperativo).toLowerCase().includes(term);

            const matchEstado = estadoFilter === 'ALL' || u.estadoOperativo === estadoFilter;

            const matchVigencia =
                vigenciaFilter === 'ALL' ||
                (vigenciaFilter === 'ACTIVE' ? u.activo : !u.activo);

            return matchText && matchEstado && matchVigencia;
        });
    }, [unidades, search, estadoFilter, vigenciaFilter]);

    // Dato derivado: Paginación cliente (siempre después de filtrar)
    const totalPages = Math.max(1, Math.ceil(filteredUnidades.length / pageSize));
    const safePage = Math.min(page, totalPages); // si un DELETE vacía la última página
    const start = (safePage - 1) * pageSize;
    const visibleUnidades = filteredUnidades.slice(start, start + pageSize);

    const handleEdit = async (id: number) => {
        try {
            setLoadingDetail(true);
            setError('');
            // GET/{id}: copia actual del recurso antes de editar (Guía 06)
            const unidad = await unidadEquipoService.obtenerPorId(id);
            setEditingUnidad(unidad);
            setMostrarFormulario(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar la unidad para edición');
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
        notifySuccess(mode === 'create' ? 'Unidad creada con éxito.' : 'Unidad actualizada con éxito.');
    };

    // ConfirmDialog handler: Reemplaza a window.confirm()
    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        const targetId = pendingDelete.id;

        try {
            setIsDeleting(true);
            setError('');
            await unidadEquipoService.eliminar(targetId);
            // La fila desaparece solo después del 204 del backend.
            setUnidades((prev) => prev.filter((item) => item.id !== targetId));
            if (editingUnidad?.id === targetId) {
                setEditingUnidad(null);
                setMostrarFormulario(false);
            }
            notifySuccess('Unidad eliminada correctamente.');
        } catch (err) {
            // 409: la unidad tiene mantenimientos; la fila se conserva y se muestra el motivo.
            setError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo eliminar la unidad. Verifique que no posea registros dependientes.',
            );
        } finally {
            setIsDeleting(false);
            setPendingDelete(null);
        }
    };

    return (
        <section className="feature-page page-stack">
            <div className="page-heading">
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
                    {mostrarFormulario ? (
                        'Cerrar Formulario'
                    ) : (
                        <>
                            <Icon name="plus" size={16} />
                            Nueva Unidad
                        </>
                    )}
                </Button>
            </div>

            {successMessage && <div className="alert alert--success" role="status">{successMessage}</div>}

            {error && <div className="state-card error alert alert--error" role="alert">{error}</div>}

            {loadingDetail && (
                <div className="alert alert--info" role="status">
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
            <div className="filter-panel">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Serie, ID, equipo o notas..."
                    label="Buscar Maquinaria"
                />

                <SelectFilter
                    label="Estado Operativo"
                    value={estadoFilter}
                    options={ESTADO_OPTIONS}
                    onChange={setEstadoFilter}
                />

                <SelectFilter
                    label="Vigencia"
                    value={vigenciaFilter}
                    options={VIGENCIA_OPTIONS}
                    onChange={setVigenciaFilter}
                />

                <SelectFilter
                    label="Registros por página"
                    value={String(pageSize)}
                    options={PAGE_SIZE_OPTIONS}
                    onChange={(val) => setPageSize(Number(val))}
                />
            </div>

            {loading ? (
                <div className="state-card loading" role="status">Cargando unidades...</div>
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

                    <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
                </>
            )}

            {/* Modal accesible para confirmar eliminación */}
            <ConfirmDialog
                open={Boolean(pendingDelete)}
                title="Eliminar Maquinaria"
                message={`¿Está seguro de que desea eliminar la unidad ${pendingDelete?.numeroSerie ?? ''}? Esta acción no se puede deshacer.`}
                confirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </section>
    );
}
