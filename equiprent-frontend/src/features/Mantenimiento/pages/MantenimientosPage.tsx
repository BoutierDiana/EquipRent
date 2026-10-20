import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { useUnidadesEquipo } from '../../UnidadEquipo/hooks/useUnidadesEquipo';
import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import MantenimientoForm from '../components/MantenimientoForm';
import MantenimientoTable from '../components/MantenimientoTable';
import type { Mantenimiento } from '../models/Mantenimiento';
import { mantenimientoService } from '../services/mantenimientoService';

const PAGE_SIZE_OPTIONS = [
    { value: '5', label: '5 por página' },
    { value: '10', label: '10 por página' },
    { value: '20', label: '20 por página' },
];

const TIPO_OPTIONS = [
    { value: 'ALL', label: 'Todos los tipos' },
    { value: 'PREVENTIVO', label: 'Preventivo' },
    { value: 'CORRECTIVO', label: 'Correctivo' },
    { value: 'INSPECCION', label: 'Inspección' },
];

export default function MantenimientosPage() {
    const {
        data: unidades,
        loading: loadingUnidades,
        error: errorUnidades,
    } = useUnidadesEquipo();

    const [mantenimientos, setMantenimientos] = useState<Mantenimiento[]>([]);
    const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);

    // Filtros combinados y paginación
    const [search, setSearch] = useState('');
    const [tipoFilter, setTipoFilter] = useState('ALL');
    const [filtroUnidadId, setFiltroUnidadId] = useState('ALL');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Estados de eliminación modal y feedback
    const [pendingDelete, setPendingDelete] = useState<Mantenimiento | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [savingDetail, setSavingDetail] = useState(false);
    const [pageError, setPageError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const notifySuccess = (msg: string) => {
        setSuccessMessage(msg);
        window.setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Mapa en memoria O(1) de unidades para búsqueda por máquina y resolución
    const unidadMap = useMemo(() => {
        return new Map<number, UnidadEquipo>(unidades.map((u) => [u.id, u]));
    }, [unidades]);

    // Opciones dinámicas para el selector de filtro por maquinaria
    const opcionesUnidades = useMemo(() => {
        return [
            { value: 'ALL', label: 'Todas las maquinarias' },
            ...unidades.map((u) => ({
                value: String(u.id),
                label: `${u.codigoInventario} (${u.marca} ${u.modelo})`,
            })),
        ];
    }, [unidades]);

    // Reiniciar a página 1 al alterar cualquier control de filtrado
    useEffect(() => {
        setPage(1);
    }, [search, tipoFilter, filtroUnidadId, pageSize]);

    // Filtros combinados: Búsqueda textual (incluye datos de la máquina vinculada) + Tipo + Maquinaria
    const filteredMantenimientos = useMemo(() => {
        const term = search.trim().toLowerCase();

        return mantenimientos.filter((item: any) => {
            const uId = item.unidadEquipoId ?? item.unidadEquipo?.id;
            const u = uId ? unidadMap.get(uId) : null;
            const infoMaquinaria = u ? `${u.codigoInventario} ${u.marca} ${u.modelo}` : '';

            const matchText =
                !term ||
                String(item.id ?? '').includes(term) ||
                String(item.descripcion ?? '').toLowerCase().includes(term) ||
                infoMaquinaria.toLowerCase().includes(term);

            const matchTipo =
                tipoFilter === 'ALL' ||
                String(item.tipo ?? item.tipoMantenimiento ?? '').toUpperCase() === tipoFilter;

            const matchUnidad =
                filtroUnidadId === 'ALL' || String(uId) === filtroUnidadId;

            return matchText && matchTipo && matchUnidad;
        });
    }, [mantenimientos, search, tipoFilter, filtroUnidadId, unidadMap]);

    // Paginación cliente
    const totalPages = Math.max(1, Math.ceil(filteredMantenimientos.length / pageSize));
    const start = (page - 1) * pageSize;
    const visibleMantenimientos = filteredMantenimientos.slice(start, start + pageSize);

    const handleEdit = async (id: number) => {
        try {
            setSavingDetail(true);
            setPageError('');
            const detalle = await mantenimientoService.obtenerPorId(id);
            setEditingMantenimiento(detalle);
            setMostrarFormulario(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setPageError(
                err instanceof Error
                    ? err.message
                    : 'No se pudo cargar el detalle de la orden',
            );
        } finally {
            setSavingDetail(false);
        }
    };

    const handleSaved = (saved: Mantenimiento, mode: 'create' | 'edit') => {
        setMantenimientos((prev) =>
            mode === 'create'
                ? [saved, ...prev]
                : prev.map((item) => (item.id === saved.id ? saved : item)),
        );
        setEditingMantenimiento(null);
        setMostrarFormulario(false);
        notifySuccess(
            mode === 'create'
                ? 'Orden registrada con éxito.'
                : 'Orden actualizada con éxito.',
        );
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        try {
            setIsDeleting(true);
            setPageError('');
            await mantenimientoService.eliminar(pendingDelete.id);
            setMantenimientos((prev) => prev.filter((m) => m.id !== pendingDelete.id));
            if (editingMantenimiento?.id === pendingDelete.id) {
                setEditingMantenimiento(null);
                setMostrarFormulario(false);
            }
            notifySuccess('Orden eliminada correctamente.');
            setPendingDelete(null);
        } catch (err) {
            setPageError(
                err instanceof Error ? err.message : 'No se pudo eliminar la orden',
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const errorTotal = pageError || errorUnidades;

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
                    <p className="eyebrow">TALLER Y MANTENIMIENTO</p>
                    <h1>Órdenes de Mantenimiento</h1>
                    <p>Gestión con búsqueda combinada, paginación y filtro por maquinaria.</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => {
                        setEditingMantenimiento(null);
                        setMostrarFormulario((prev) => !prev);
                    }}
                >
                    {mostrarFormulario ? 'Cerrar Formulario' : '+ Nueva Orden'}
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

            {errorTotal && (
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
                    {errorTotal}
                </div>
            )}

            {savingDetail && (
                <div
                    className="state-card"
                    style={{
                        padding: '0.8rem',
                        background: '#e0f2fe',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                    }}
                >
                    Cargando detalle de la orden seleccionada...
                </div>
            )}

            {mostrarFormulario && (
                <MantenimientoForm
                    unidades={unidades}
                    mantenimiento={editingMantenimiento}
                    onSaved={handleSaved}
                    onCancelEdit={() => {
                        setEditingMantenimiento(null);
                        setMostrarFormulario(false);
                    }}
                />
            )}

            {/* Barra de Filtros Combinados */}
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
                    placeholder="ID, descripción, marca o modelo..."
                    label="Buscar Orden"
                />

                <SelectFilter
                    label="Filtrar por Maquinaria"
                    value={filtroUnidadId}
                    options={opcionesUnidades}
                    onChange={setFiltroUnidadId}
                />

                <SelectFilter
                    label="Tipo de Servicio"
                    value={tipoFilter}
                    options={TIPO_OPTIONS}
                    onChange={setTipoFilter}
                />

                <SelectFilter
                    label="Registros por página"
                    value={String(pageSize)}
                    options={PAGE_SIZE_OPTIONS}
                    onChange={(val) => setPageSize(Number(val))}
                />
            </div>

            {loadingUnidades ? (
                <div
                    className="state-card"
                    style={{
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '8px',
                    }}
                >
                    Cargando registros...
                </div>
            ) : filteredMantenimientos.length === 0 ? (
                <EmptyState
                    title="No se encontraron órdenes de mantenimiento"
                    description="Pruebe cambiando los filtros de tipo, maquinaria o el texto de búsqueda."
                />
            ) : (
                <>
                    <MantenimientoTable
                        mantenimientos={visibleMantenimientos}
                        unidades={unidades}
                        onEdit={handleEdit}
                        onDelete={(m) => setPendingDelete(m)}
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
                title="Eliminar Orden de Mantenimiento"
                message={`¿Está seguro de eliminar la orden #${pendingDelete?.id ?? ''}? Esta acción no se puede deshacer.`}
                confirming={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
        </section>
    );
}