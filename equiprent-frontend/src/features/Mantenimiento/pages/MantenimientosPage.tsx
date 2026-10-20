import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Icon } from '../../../components/ui/Icon';
import { Pagination } from '../../../components/ui/Pagination';
import { SearchInput } from '../../../components/ui/SearchInput';
import { SelectFilter } from '../../../components/ui/SelectFilter';
import { useUnidadesEquipo } from '../../UnidadEquipo/hooks/useUnidadesEquipo';
import type { UnidadEquipo } from '../../UnidadEquipo/models/UnidadEquipo';
import { describirUnidad } from '../../UnidadEquipo/utils/unidadEquipoFormat';
import MantenimientoForm from '../components/MantenimientoForm';
import MantenimientoTable from '../components/MantenimientoTable';
import { useMantenimientos } from '../hooks/useMantenimiento';
import {
    ESTADO_MANTENIMIENTO_LABELS,
    ESTADOS_MANTENIMIENTO,
    TIPO_MANTENIMIENTO_LABELS,
    TIPOS_MANTENIMIENTO,
    type Mantenimiento,
} from '../models/Mantenimiento';
import { mantenimientoService } from '../services/mantenimientoService';

const PAGE_SIZE_OPTIONS = [
    { value: '5', label: '5 por página' },
    { value: '10', label: '10 por página' },
    { value: '20', label: '20 por página' },
];

const TIPO_OPTIONS = [
    { value: 'ALL', label: 'Todos los tipos' },
    ...TIPOS_MANTENIMIENTO.map((tipo) => ({ value: tipo, label: TIPO_MANTENIMIENTO_LABELS[tipo] })),
];

const ESTADO_OPTIONS = [
    { value: 'ALL', label: 'Todos los estados' },
    ...ESTADOS_MANTENIMIENTO.map((estado) => ({ value: estado, label: ESTADO_MANTENIMIENTO_LABELS[estado] })),
];

export default function MantenimientosPage() {
    const {
        data: unidades,
        loading: loadingUnidades,
        error: errorUnidades,
    } = useUnidadesEquipo();

    // Filtro por entidad padre: cambia la petición (GET /mantenimientos/unidad-equipo/{id}).
    // Al cambiar, useAsyncList aborta la petición anterior con AbortController.
    const [filtroUnidadId, setFiltroUnidadId] = useState('ALL');
    const unidadSeleccionada = filtroUnidadId === 'ALL' ? undefined : Number(filtroUnidadId);

    const {
        data: mantenimientos,
        setData: setMantenimientos,
        loading: loadingMantenimientos,
        error: errorMantenimientos,
    } = useMantenimientos(unidadSeleccionada);

    const [editingMantenimiento, setEditingMantenimiento] = useState<Mantenimiento | null>(null);

    // Filtros combinados y paginación
    const [search, setSearch] = useState('');
    const [tipoFilter, setTipoFilter] = useState('ALL');
    const [estadoFilter, setEstadoFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // Estados de eliminación modal y feedback
    const [pendingDelete, setPendingDelete] = useState<Mantenimiento | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [pageError, setPageError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const notifySuccess = (msg: string) => {
        setSuccessMessage(msg);
        window.setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Mapa en memoria O(1) de unidades para búsqueda por máquina
    const unidadMap = useMemo(
        () => new Map<number, UnidadEquipo>(unidades.map((u) => [u.id, u])),
        [unidades],
    );

    // Opciones dinámicas para el selector de filtro por maquinaria
    const opcionesUnidades = useMemo(
        () => [
            { value: 'ALL', label: 'Todas las maquinarias' },
            ...unidades.map((u) => ({ value: String(u.id), label: describirUnidad(u) })),
        ],
        [unidades],
    );

    // Reiniciar a página 1 al alterar cualquier control de filtrado
    useEffect(() => {
        setPage(1);
    }, [search, tipoFilter, estadoFilter, filtroUnidadId, pageSize]);

    // Filtros combinados: texto (incluye la serie de la unidad padre) AND tipo AND estado AND unidad
    const filteredMantenimientos = useMemo(() => {
        const term = search.trim().toLowerCase();

        return mantenimientos.filter((item) => {
            const unidad = unidadMap.get(item.unidadEquipoId);
            const texto = [
                String(item.id),
                unidad?.numeroSerie ?? '',
                TIPO_MANTENIMIENTO_LABELS[item.tipo],
                ESTADO_MANTENIMIENTO_LABELS[item.estado],
            ]
                .join(' ')
                .toLowerCase();

            const matchText = !term || texto.includes(term);
            const matchTipo = tipoFilter === 'ALL' || item.tipo === tipoFilter;
            const matchEstado = estadoFilter === 'ALL' || item.estado === estadoFilter;
            // Se mantiene en local para ocultar una orden recién creada en otra unidad.
            const matchUnidad = unidadSeleccionada === undefined || item.unidadEquipoId === unidadSeleccionada;

            return matchText && matchTipo && matchEstado && matchUnidad;
        });
    }, [mantenimientos, search, tipoFilter, estadoFilter, unidadSeleccionada, unidadMap]);

    // Paginación cliente
    const totalPages = Math.max(1, Math.ceil(filteredMantenimientos.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const visibleMantenimientos = filteredMantenimientos.slice(start, start + pageSize);

    const handleEdit = async (id: number) => {
        try {
            setLoadingDetail(true);
            setPageError('');
            const detalle = await mantenimientoService.obtenerPorId(id);
            setEditingMantenimiento(detalle);
            setMostrarFormulario(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            setPageError(err instanceof Error ? err.message : 'No se pudo cargar el detalle de la orden');
        } finally {
            setLoadingDetail(false);
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
        notifySuccess(mode === 'create' ? 'Orden registrada con éxito.' : 'Orden actualizada con éxito.');
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;
        const targetId = pendingDelete.id;

        try {
            setIsDeleting(true);
            setPageError('');
            await mantenimientoService.eliminar(targetId);
            setMantenimientos((prev) => prev.filter((m) => m.id !== targetId));
            if (editingMantenimiento?.id === targetId) {
                setEditingMantenimiento(null);
                setMostrarFormulario(false);
            }
            notifySuccess('Orden eliminada correctamente.');
        } catch (err) {
            setPageError(err instanceof Error ? err.message : 'No se pudo eliminar la orden');
        } finally {
            setIsDeleting(false);
            setPendingDelete(null);
        }
    };

    const loading = loadingUnidades || loadingMantenimientos;
    const errorTotal = pageError || errorMantenimientos || errorUnidades;

    return (
        <section className="feature-page page-stack">
            <div className="page-heading">
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
                    {mostrarFormulario ? (
                        'Cerrar Formulario'
                    ) : (
                        <>
                            <Icon name="plus" size={16} />
                            Nueva Orden
                        </>
                    )}
                </Button>
            </div>

            {successMessage && <div className="alert alert--success" role="status">{successMessage}</div>}

            {errorTotal && <div className="state-card error alert alert--error" role="alert">{errorTotal}</div>}

            {loadingDetail && (
                <div className="alert alert--info" role="status">Cargando detalle de la orden seleccionada...</div>
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
            <div className="filter-panel">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="ID, serie, tipo o estado..."
                    label="Buscar Orden"
                />

                <SelectFilter
                    label="Filtrar por Maquinaria"
                    value={filtroUnidadId}
                    options={opcionesUnidades}
                    onChange={setFiltroUnidadId}
                />

                <SelectFilter label="Tipo de Servicio" value={tipoFilter} options={TIPO_OPTIONS} onChange={setTipoFilter} />

                <SelectFilter label="Estado de la Orden" value={estadoFilter} options={ESTADO_OPTIONS} onChange={setEstadoFilter} />

                <SelectFilter
                    label="Registros por página"
                    value={String(pageSize)}
                    options={PAGE_SIZE_OPTIONS}
                    onChange={(val) => setPageSize(Number(val))}
                />
            </div>

            {loading ? (
                <div className="state-card loading" role="status">Cargando registros...</div>
            ) : filteredMantenimientos.length === 0 ? (
                <EmptyState
                    title="No se encontraron órdenes de mantenimiento"
                    description="Pruebe cambiando los filtros de tipo, estado, maquinaria o el texto de búsqueda."
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

                    <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
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
