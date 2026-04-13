export interface Usuario {
  id: string;
  email: string;
  nombreCompleto: string;
  rol: 'Admin' | 'Operador' | 'Visualizador';
  activo: boolean;
}

export interface Infraestructura {
  id: string;
  nombre: string;
  tipo: string;
  estado: 'Operativa' | 'Mantenimiento' | 'FueraDeServicio' | 'Danada';
  region: string;
  latitud: number;
  longitud: number;
  capacidadMaxima?: number;
  capacidadActual?: number;
  responsable?: Usuario;
  createdAt: string;
  updatedAt: string;
}

export interface Incidente {
  id: string;
  titulo: string;
  descripcion: string;
  severidad: 'Baja' | 'Media' | 'Alta' | 'Critica';
  estado: 'Abierto' | 'EnProgreso' | 'Resuelto' | 'Cancelado';
  fechaReporte: string;
  fechaResolucion?: string;
  notasResolucion?: string;
  infrastructuraId: string;
  infrastructuraNombre?: string;
  asignadoAId?: string;
  asignadoANombre?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: Usuario;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ResumenEstadisticas {
  totalInfraestructuras: number;
  infraestructurasOperativas: number;
  infraestructurasMantenimiento: number;
  infraestructurasFueraDeServicio: number;
  infraestructurasDanadas: number;
  incidentesAbiertos: number;
  incidentesCriticos: number;
  incidentesEnProgreso: number;
  incidentesResueltos: number;
  totalIncidentes: number;
}

export interface InfraestructurasPorRegion {
  region: string;
  total: number;
}
