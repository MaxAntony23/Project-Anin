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

const storedToken = authService.getToken();
const storedUser = authService.getStoredUser();

export const useAuthStore = create<AuthState>(() => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!(storedToken && storedUser),

  login: async (email, password) => {
    const response = await authService.login(email, password);
    authService.setTokens(response.token, response.refreshToken, response.user);
    useAuthStore.setState({ user: response.user, token: response.token, isAuthenticated: true });
  },

  logout: () => {
    authService.logout();
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  },

  initializeAuth: () => {},
}));
