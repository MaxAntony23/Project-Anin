import api from './api';
import type { LoginResponse, Usuario } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', { email, password });
    return res.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  setTokens(token: string, refreshToken: string, user: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getStoredUser(): Usuario | null {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as Usuario) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
