import { create } from 'zustand';
import type { Usuario } from '../types';
import { authService } from '../services';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email, password) => {
    const response = await authService.login(email, password);
    authService.setTokens(response.token, response.refreshToken, response.user);
    set({ user: response.user, token: response.token, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = authService.getToken();
    const user = authService.getStoredUser();
    if (token && user) {
      set({ user, token, isAuthenticated: true });
    }
  },
}));
