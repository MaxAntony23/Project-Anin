import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Agregar token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejar 401: intentar refresh o redirigir a login
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        original.headers.Authorization = `Bearer ${res.data.token}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;

// ─── Infraestructuras ────────────────────────────────────────────────────────
export const infraestructuraAPI = {
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    region?: string;
    estado?: string;
    tipo?: string;
    search?: string;
  }) => api.get('/Infraestructuras', { params }),

  getById: (id: string) => api.get(`/Infraestructuras/${id}`),

  create: (data: {
    nombre: string;
    tipo: string;
    estado: string;
    region: string;
    latitud: number;
    longitud: number;
    capacidadMaxima?: number;
    capacidadActual?: number;
    responsableId?: string;
  }) => api.post('/Infraestructuras', data),

  update: (id: string, data: {
    nombre: string;
    tipo: string;
    estado: string;
    region: string;
    latitud: number;
    longitud: number;
    capacidadMaxima?: number;
    capacidadActual?: number;
    responsableId?: string;
  }) => api.put(`/Infraestructuras/${id}`, data),

  delete: (id: string) => api.delete(`/Infraestructuras/${id}`),
};

// ─── Incidentes ──────────────────────────────────────────────────────────────
export const incidenteAPI = {
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    estado?: string;
    severidad?: string;
    infraestructuraId?: string;
  }) => api.get('/Incidentes', { params }),

  getById: (id: string) => api.get(`/Incidentes/${id}`),

  create: (data: {
    titulo: string;
    descripcion: string;
    severidad: string;
    infraestructuraId: string;
  }) => api.post('/Incidentes', data),

  asignar: (id: string, usuarioId: string) =>
    api.put(`/Incidentes/${id}/asignar`, { usuarioId }),

  resolver: (id: string, data: { notasResolucion: string }) =>
    api.patch(`/Incidentes/${id}/resolver`, data),
};

// ─── Usuarios ────────────────────────────────────────────────────────────────
export const usuariosAPI = {
  getAll: () => api.get('/auth/usuarios'),
};
