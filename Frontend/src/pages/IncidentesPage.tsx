import { useEffect, useState, useCallback } from 'react';
import { incidenteAPI, infraestructuraAPI, usuariosAPI } from '../services';
import { DataTable, Modal, Pagination } from '../components';
import type { Incidente, PaginatedResponse, Infraestructura, Usuario } from '../types';

const SEVERIDADES = ['Baja', 'Media', 'Alta', 'Critica'];
const ESTADOS = ['Abierto', 'EnProgreso', 'Resuelto', 'Cancelado'];

const severidadBadge: Record<string, string> = {
  Baja: 'bg-blue-100 text-blue-700',
  Media: 'bg-yellow-100 text-yellow-700',
  Alta: 'bg-orange-100 text-orange-700',
  Critica: 'bg-red-100 text-red-700',
};

const estadoBadge: Record<string, string> = {
  Abierto: 'bg-red-100 text-red-700',
  EnProgreso: 'bg-blue-100 text-blue-700',
  Resuelto: 'bg-green-100 text-green-700',
  Cancelado: 'bg-gray-100 text-gray-600',
};

export const IncidentesPage: React.FC = () => {
  const [data, setData] = useState<PaginatedResponse<Incidente> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ estado: '', severidad: '' });
  const [infraestructuras, setInfraestructuras] = useState<Infraestructura[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Modal state
  const [viewItem, setViewItem] = useState<Incidente | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [resolveItem, setResolveItem] = useState<Incidente | null>(null);
  const [asignarItem, setAsignarItem] = useState<Incidente | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState({
    titulo: '',
    descripcion: '',
    severidad: 'Media',
    infraestructuraId: '',
  });
  const [resolveNotes, setResolveNotes] = useState('');
  const [asignarUsuarioId, setAsignarUsuarioId] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await incidenteAPI.getAll({
        page,
        pageSize: 10,
        estado: filters.estado || undefined,
        severidad: filters.severidad || undefined,
      });
      setData(res.data);
    } catch {
      console.error('Error cargando incidentes');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    infraestructuraAPI.getAll({ pageSize: 100 })
      .then((r) => setInfraestructuras(r.data.items ?? []))
      .catch(() => {});
    usuariosAPI.getAll()
      .then((r) => setUsuarios(r.data))
      .catch(() => {});
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await incidenteAPI.create(createForm);
      setShowCreate(false);
      setCreateForm({ titulo: '', descripcion: '', severidad: 'Media', infraestructuraId: '' });
      fetchData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Error al crear el incidente.');
    } finally {
      setSaving(false);
    }
  };

  const handleResolver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolveItem) return;
    setSaving(true);
    try {
      await incidenteAPI.resolver(resolveItem.id, { notasResolucion: resolveNotes });
      setResolveItem(null);
      setResolveNotes('');
      fetchData();
    } catch {
      alert('Error al resolver el incidente.');
    } finally {
      setSaving(false);
    }
  };

  const handleAsignar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!asignarItem || !asignarUsuarioId) return;
    setSaving(true);
    try {
      await incidenteAPI.asignar(asignarItem.id, asignarUsuarioId);
      setAsignarItem(null);
      setAsignarUsuarioId('');
      fetchData();
    } catch {
      alert('Error al asignar el incidente.');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'titulo', header: 'Título' },
    {
      key: 'severidad',
      header: 'Severidad',
      render: (i: Incidente) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severidadBadge[i.severidad] ?? 'bg-gray-100 text-gray-700'}`}>
          {i.severidad}
        </span>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (i: Incidente) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[i.estado] ?? 'bg-gray-100 text-gray-700'}`}>
          {i.estado}
        </span>
      ),
    },
    {
      key: 'infrastructuraNombre',
      header: 'Infraestructura',
      render: (i: Incidente) => i.infrastructuraNombre ?? '—',
    },
    {
      key: 'asignadoANombre',
      header: 'Asignado a',
      render: (i: Incidente) => i.asignadoANombre ?? <span className="text-gray-400 italic">Sin asignar</span>,
    },
    {
      key: 'fechaReporte',
      header: 'Fecha reporte',
      render: (i: Incidente) => new Date(i.fechaReporte).toLocaleDateString('es-PE'),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Incidentes</h1>
          <p className="text-gray-500 text-sm">Gestión de incidentes e interrupciones</p>
        </div>
        <button
          onClick={() => { setCreateForm({ titulo: '', descripcion: '', severidad: 'Media', infraestructuraId: '' }); setFormError(''); setShowCreate(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nuevo incidente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3">
        <select
          value={filters.estado}
          onChange={(e) => { setFilters({ ...filters, estado: e.target.value }); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
        <select
          value={filters.severidad}
          onChange={(e) => { setFilters({ ...filters, severidad: e.target.value }); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las severidades</option>
          {SEVERIDADES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          loading={loading}
          onView={setViewItem}
          emptyMessage="No se encontraron incidentes"
        />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal Ver */}
      <Modal
        isOpen={!!viewItem}
        onClose={() => setViewItem(null)}
        title="Detalle del incidente"
        size="md"
        footer={
          viewItem && (viewItem.estado === 'Abierto' || viewItem.estado === 'EnProgreso') ? (
            <>
              {!viewItem.asignadoAId && (
                <button
                  onClick={() => { setAsignarItem(viewItem); setViewItem(null); }}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Asignar
                </button>
              )}
              <button
                onClick={() => { setResolveItem(viewItem); setViewItem(null); }}
                className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Resolver
              </button>
            </>
          ) : undefined
        }
      >
        {viewItem && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2"><span className="text-gray-500">Título:</span> <strong>{viewItem.titulo}</strong></div>
              <div>
                <span className="text-gray-500">Severidad:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severidadBadge[viewItem.severidad] ?? ''}`}>
                  {viewItem.severidad}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Estado:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[viewItem.estado] ?? ''}`}>
                  {viewItem.estado}
                </span>
              </div>
              <div><span className="text-gray-500">Infraestructura:</span> {viewItem.infrastructuraNombre ?? '—'}</div>
              <div><span className="text-gray-500">Asignado a:</span> {viewItem.asignadoANombre ?? 'Sin asignar'}</div>
              <div><span className="text-gray-500">Fecha reporte:</span> {new Date(viewItem.fechaReporte).toLocaleDateString('es-PE')}</div>
              {viewItem.fechaResolucion && (
                <div><span className="text-gray-500">Fecha resolución:</span> {new Date(viewItem.fechaResolucion).toLocaleDateString('es-PE')}</div>
              )}
              <div className="col-span-2">
                <span className="text-gray-500">Descripción:</span>
                <p className="mt-1 text-gray-700 bg-gray-50 rounded p-2">{viewItem.descripcion}</p>
              </div>
              {viewItem.notasResolucion && (
                <div className="col-span-2">
                  <span className="text-gray-500">Notas de resolución:</span>
                  <p className="mt-1 text-gray-700 bg-green-50 rounded p-2">{viewItem.notasResolucion}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Crear */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Nuevo incidente"
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="incidente-form"
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Crear'}
            </button>
          </>
        }
      >
        <form id="incidente-form" onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded">{formError}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              required
              value={createForm.titulo}
              onChange={(e) => setCreateForm({ ...createForm, titulo: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
            <textarea
              required
              rows={3}
              value={createForm.descripcion}
              onChange={(e) => setCreateForm({ ...createForm, descripcion: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severidad *</label>
              <select
                value={createForm.severidad}
                onChange={(e) => setCreateForm({ ...createForm, severidad: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SEVERIDADES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Infraestructura *</label>
              <select
                required
                value={createForm.infraestructuraId}
                onChange={(e) => setCreateForm({ ...createForm, infraestructuraId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {infraestructuras.map((i) => (
                  <option key={i.id} value={i.id}>{i.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal Resolver */}
      <Modal
        isOpen={!!resolveItem}
        onClose={() => setResolveItem(null)}
        title="Resolver incidente"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setResolveItem(null)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="resolve-form"
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Marcar resuelto'}
            </button>
          </>
        }
      >
        <form id="resolve-form" onSubmit={handleResolver} className="space-y-3">
          <p className="text-sm text-gray-600">
            Resolviendo: <strong>{resolveItem?.titulo}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas de resolución *</label>
            <textarea
              required
              rows={4}
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Describe cómo se resolvió el incidente..."
            />
          </div>
        </form>
      </Modal>

      {/* Modal Asignar */}
      <Modal
        isOpen={!!asignarItem}
        onClose={() => setAsignarItem(null)}
        title="Asignar incidente"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setAsignarItem(null)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="asignar-form"
              disabled={saving || !asignarUsuarioId}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Asignar'}
            </button>
          </>
        }
      >
        <form id="asignar-form" onSubmit={handleAsignar} className="space-y-3">
          <p className="text-sm text-gray-600">
            Asignando: <strong>{asignarItem?.titulo}</strong>
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asignar a *</label>
            <select
              required
              value={asignarUsuarioId}
              onChange={(e) => setAsignarUsuarioId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar usuario...</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>{u.nombreCompleto} ({u.rol})</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
