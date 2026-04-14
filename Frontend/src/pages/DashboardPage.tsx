import { useEffect, useState } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { api } from '../services';
import { MapComponent, ResumenCard, LoadingSpinner } from '../components';
import type { Infraestructura, ResumenEstadisticas, InfraestructurasPorRegion } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const DashboardPage: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<ResumenEstadisticas | null>(null);
  const [porRegion, setPorRegion] = useState<InfraestructurasPorRegion[]>([]);
  const [infraestructuras, setInfraestructuras] = useState<Infraestructura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, regionRes, infrasRes] = await Promise.all([
          api.get('/estadisticas/resumen'),
          api.get('/estadisticas/por-region'),
          api.get('/Infraestructuras?pageSize=100'),
        ]);
        setEstadisticas(statsRes.data);
        setPorRegion(regionRes.data);
        setInfraestructuras(infrasRes.data.items);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  const donutData = estadisticas ? {
    labels: ['Operativa', 'Mantenimiento', 'Fuera de servicio', 'Dañada'],
    datasets: [{
      data: [
        estadisticas.infraestructurasOperativas,
        estadisticas.infraestructurasMantenimiento,
        estadisticas.infraestructurasFueraDeServicio,
        estadisticas.infraestructurasDanadas,
      ],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444', '#f97316'],
      borderWidth: 2,
    }],
  } : null;

  const barData = {
    labels: porRegion.map((r) => r.region),
    datasets: [{
      label: 'Infraestructuras',
      data: porRegion.map((r) => r.total),
      backgroundColor: '#3b82f6',
      borderRadius: 6,
    }],
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Título */}
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen de infraestructuras e incidentes activos</p>
      </div>

      {/* KPI Cards */}
      {estadisticas && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <ResumenCard title="Total Infraestructuras" value={estadisticas.totalInfraestructuras} icon="🏗️" color="blue" />
          <ResumenCard title="Operativas" value={estadisticas.infraestructurasOperativas} icon="✅" color="green" subtitle="En funcionamiento" />
          <ResumenCard title="En Mantenimiento" value={estadisticas.infraestructurasMantenimiento} icon="🔧" color="yellow" />
          <ResumenCard title="Fuera de Servicio" value={estadisticas.infraestructurasFueraDeServicio} icon="🚫" color="red" />
          <ResumenCard title="Total Incidentes" value={estadisticas.totalIncidentes} icon="📋" color="purple" />
          <ResumenCard title="Incidentes Abiertos" value={estadisticas.incidentesAbiertos} icon="⚠️" color="orange" />
          <ResumenCard title="En Progreso" value={estadisticas.incidentesEnProgreso} icon="🔄" color="blue" />
          <ResumenCard title="Incidentes Críticos" value={estadisticas.incidentesCriticos} icon="🔴" color="red" subtitle="Atención urgente" />
        </div>
      )}

      {/* Charts + Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        {/* Donut */}
        {donutData && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
            <h2 className="font-semibold text-gray-700 mb-4">Estado de infraestructuras</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={donutData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        )}

        {/* Bar chart */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Infraestructuras por región</h2>
          <Bar
            data={barData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
            }}
          />
        </div>

        {/* Incidentes summary */}
        {estadisticas && (
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 md:col-span-2 lg:col-span-1">
            <h2 className="font-semibold text-gray-700 mb-4">Estado de incidentes</h2>
            <div className="space-y-3">
              {[
                { label: 'Abiertos', value: estadisticas.incidentesAbiertos, color: 'bg-red-500' },
                { label: 'En Progreso', value: estadisticas.incidentesEnProgreso, color: 'bg-blue-500' },
                { label: 'Resueltos', value: estadisticas.incidentesResueltos, color: 'bg-green-500' },
                { label: 'Críticos', value: estadisticas.incidentesCriticos, color: 'bg-orange-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm text-gray-600 flex-1">{label}</span>
                  <span className="font-bold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-5">
        <h2 className="font-semibold text-gray-700 mb-4">
          Mapa de infraestructuras — Perú
          <span className="ml-2 text-xs font-normal text-gray-400">({infraestructuras.length} activas)</span>
        </h2>
        <MapComponent infraestructuras={infraestructuras} />
      </div>
    </div>
  );
};
