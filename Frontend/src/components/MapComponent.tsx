import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Infraestructura } from '../types';

// Fix Leaflet default icons en Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const estadoBadge: Record<string, string> = {
  Operativa:       'bg-green-100 text-green-700',
  Mantenimiento:   'bg-yellow-100 text-yellow-700',
  FueraDeServicio: 'bg-red-100 text-red-700',
  Danada:          'bg-orange-100 text-orange-700',
};

interface Props {
  infraestructuras: Infraestructura[];
}

export const MapComponent: React.FC<Props> = ({ infraestructuras }) => {
  const center: [number, number] = infraestructuras.length > 0
    ? [infraestructuras[0].latitud, infraestructuras[0].longitud]
    : [-12.046, -77.043];

  return (
    <MapContainer center={center} zoom={6} style={{ height: '480px', borderRadius: '8px', zIndex: 0 }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {infraestructuras.map((infra) => (
        <Marker key={infra.id} position={[infra.latitud, infra.longitud]}>
          <Popup>
            <div className="min-w-[180px]">
              <h3 className="font-bold text-sm mb-1">{infra.nombre}</h3>
              <p className="text-xs text-gray-600">Tipo: {infra.tipo}</p>
              <p className="text-xs text-gray-600">Región: {infra.region}</p>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadge[infra.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                {infra.estado}
              </span>
              {infra.capacidadActual != null && infra.capacidadMaxima != null && (
                <p className="text-xs text-gray-500 mt-1">
                  Capacidad: {infra.capacidadActual} / {infra.capacidadMaxima}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
