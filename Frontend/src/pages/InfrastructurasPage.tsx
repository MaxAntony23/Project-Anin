import { useEffect, useState, useCallback } from 'react';
import { infraestructuraAPI, usuariosAPI } from '../services';
import { DataTable, Modal, Pagination } from '../components';
import type { Infraestructura, PaginatedResponse, Usuario } from '../types';

const TIPOS = ['Puente', 'Carretera', 'Puerto', 'Aeropuerto', 'Ferrocarril', 'Presa', 'Túnel', 'Otro'];
const ESTADOS = ['Operativa', 'Mantenimiento', 'FueraDeServicio', 'Danada'];
const REGIONES = ['Lima', 'Arequipa', 'Cusco', 'Junín', 'La Libertad', 'Piura', 'Cajamarca', 'Puno', 'Loreto', 'Ucayali'];

const estadoBadge: Record<string, string> = {
  Operativa: 'bg-green-100 text-green-700',
  Mantenimiento: 'bg-yellow-100 text-yellow-700',
  FueraDeServicio: 'bg-red-100 text-red-700',
  Danada: 'bg-orange-100 text-orange-700',
};

interface FormData {
  nombre: string;
  tipo: string;
  estado: string;
  region: string;
  latitud: string;
  longitud: string;
  capacidadMaxima: string;
  capacidadActual: string;
  responsableId: string;
}

const emptyForm: FormData = {
  nombre: '',
  tipo: 'Puente',
  estado: 'Operativa',
  region: 'Lima',
  latitud: '',
  longitud: '',
  capacidadMaxima: '',
  capacidadActual: '',
  responsableId: '',
};

export const InfrastructurasPage: React.FC = () => {
  const [data, setData] = useState<PaginatedResponse<Infraestructura> | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ region: '', estado: '', search: '' });
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  // Modal state
  const [viewItem, setViewItem] = useState<Infraestructura | null>(null);
  const [editItem, setEditItem] = useState<Infraestructura | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Infraestructura | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await infraestructuraAPI.getAll({
        page,
        pageSize: 10,
        region: filters.region || undefined,
        estado: filters.estado || undefined,
        search: filters.search || undefined,
      });
      setData(res.data);
    } catch {
      console.error('Error cargando infraestructuras');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    usuariosAPI.getAll()
      .then((r) => setUsuarios(r.data))
      .catch(() => {});
  }, []);

  const openCreate = () => {
    setFormData(emptyForm);
    setFormError('');
    setShowCreate(true);
  };

  const openEdit = (item: Infraestructura) => {
    setFormData({
      nombre: item.nombre,
      tipo: item.tipo,
      estado: item.estado,
      region: item.region,
      latitud: String(item.latitud),
      longitud: String(item.longitud),
      capacidadMaxima: item.capacidadMaxima != null ? String(item.capacidadMaxima) : '',
      capacidadActual: item.capacidadActual != null ? String(item.capacidadActual) : '',
      responsableId: item.responsable?.id ?? '',
    });
    setFormError('');
    setEditItem(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = {
        nombre: formData.nombre,
        tipo: formData.tipo,
        estado: formData.estado,
        region: formData.region,
        latitud: parseFloat(formData.latitud),
        longitud: parseFloat(formData.longitud),
        capacidadMaxima: formData.capacidadMaxima ? parseInt(formData.capacidadMaxima) : undefined,
        capacidadActual: formData.capacidadActual ? parseInt(formData.capacidadActual) : undefined,
        responsableId: formData.responsableId || undefined,
      };
      if (editItem) {
        await infraestructuraAPI.update(editItem.id, payload);
        setEditItem(null);
      } else {
        await infraestructuraAPI.create(payload);
        setShowCreate(false);
      }
      fetchData();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Error al guardar. Verifica los datos.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await infraestructuraAPI.delete(deleteItem.id);
      setDeleteItem(null);
      fetchData();
    } catch {
      alert('Error al eliminar la infraestructura.');
    }
  };

  const columns = [
    { key: 'nombre', header: 'Nombre' },
    { key: 'tipo', header: 'Tipo' },
    { key: 'region', header: 'Región' },
    {
      key: 'estado',
      header: 'Estado',
      render: (i: Infraestructura) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[i.estado] ?? 'bg-gray-100 text-gray-700'}`}>
          {i.estado}
        </span>
      ),
    },
    {
      key: 'capacidad',
      header: 'Capacidad',
      render: (i: Infraestructura) =>
        i.capacidadMaxima != null ? `${i.capacidadActual ?? 0} / ${i.capacidadMaxima}` : '—',
    },
    {
      key: 'responsable',
      header: 'Responsable',
      render: (i: Infraestructura) => i.responsable?.nombreCompleto ?? '—',
    },
  ];

  const FormBody = (
    <form id="infra-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {formError && (
        <div className="col-span-2 bg-red-50 text-red-700 text-sm px-3 py-2 rounded">{formError}</div>
      )}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input
          required
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
        <select
          value={formData.tipo}
          onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TIPOS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Región *</label>
        <select
          value={formData.region}
          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {REGIONES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
        <select
          value={formData.responsableId}
          onChange={(e) => setFormData({ ...formData, responsableId: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sin asignar</option>
          {usuarios.map((u) => <option key={u.id} value={u.id}>{u.nombreCompleto}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Latitud *</label>
        <input
          required
          type="number"
          step="any"
          value={formData.latitud}
          onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="-12.046"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Longitud *</label>
        <input
          required
          type="number"
          step="any"
          value={formData.longitud}
          onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="-77.043"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Máxima</label>
        <input
          type="number"
          value={formData.capacidadMaxima}
          onChange={(e) => setFormData({ ...formData, capacidadMaxima: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad Actual</label>
        <input
          type="number"
          value={formData.capacidadActual}
          onChange={(e) => setFormData({ ...formData, capacidadActual: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </form>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Infraestructuras</h1>
          <p className="text-gray-500 text-sm">Gestión de infraestructuras nacionales</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors self-start sm:self-auto"
        >
          + Nueva infraestructura
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filters.search}
          onChange={(e) => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 min-w-[180px]"
        />
        <select
          value={filters.region}
          onChange={(e) => { setFilters({ ...filters, region: e.target.value }); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todas las regiones</option>
          {REGIONES.map((r) => <option key={r}>{r}</option>)}
        </select>
        <select
          value={filters.estado}
          onChange={(e) => { setFilters({ ...filters, estado: e.target.value }); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <DataTable
          columns={columns}
          data={data?.items ?? []}
          loading={loading}
          onView={setViewItem}
          onEdit={openEdit}
          onDelete={setDeleteItem}
          emptyMessage="No se encontraron infraestructuras"
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
        title="Detalle de infraestructura"
        size="md"
      >
        {viewItem && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-gray-500">Nombre:</span> <strong>{viewItem.nombre}</strong></div>
              <div><span className="text-gray-500">Tipo:</span> {viewItem.tipo}</div>
              <div><span className="text-gray-500">Región:</span> {viewItem.region}</div>
              <div>
                <span className="text-gray-500">Estado:</span>{' '}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadge[viewItem.estado] ?? ''}`}>
                  {viewItem.estado}
                </span>
              </div>
              <div><span className="text-gray-500">Latitud:</span> {viewItem.latitud}</div>
              <div><span className="text-gray-500">Longitud:</span> {viewItem.longitud}</div>
              {viewItem.capacidadMaxima != null && (
                <div className="col-span-2">
                  <span className="text-gray-500">Capacidad:</span> {viewItem.capacidadActual} / {viewItem.capacidadMaxima}
                </div>
              )}
              {viewItem.responsable && (
                <div className="col-span-2">
                  <span className="text-gray-500">Responsable:</span> {viewItem.responsable.nombreCompleto}
                </div>
              )}
              <div><span className="text-gray-500">Creado:</span> {new Date(viewItem.createdAt).toLocaleDateString('es-PE')}</div>
              <div><span className="text-gray-500">Actualizado:</span> {new Date(viewItem.updatedAt).toLocaleDateString('es-PE')}</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Crear / Editar */}
      <Modal
        isOpen={showCreate || !!editItem}
        onClose={() => { setShowCreate(false); setEditItem(null); }}
        title={editItem ? 'Editar infraestructura' : 'Nueva infraestructura'}
        size="lg"
        footer={
          <>
            <button
              onClick={() => { setShowCreate(false); setEditItem(null); }}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="infra-form"
              disabled={saving}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : editItem ? 'Actualizar' : 'Crear'}
            </button>
          </>
        }
      >
        {FormBody}
      </Modal>

      {/* Modal Eliminar */}
      <Modal
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title="Confirmar eliminación"
        size="sm"
        footer={
          <>
            <button
              onClick={() => setDeleteItem(null)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          ¿Estás seguro de que deseas eliminar{' '}
          <strong>{deleteItem?.nombre}</strong>? Esta acción no se puede deshacer.
        </p>
      </Modal>
    </div>
  );
};
