import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthStore } from '../store';
import logoAnin from '/logo-anin.webp';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (rol: string) => {
    if (rol === 'admin')    { setEmail('admin@test.com');        setPassword('123456'); }
    if (rol === 'operador') { setEmail('operador@test.com');     setPassword('123456'); }
    if (rol === 'viewer')   { setEmail('visualizador@test.com'); setPassword('123456'); }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img src={logoAnin} alt="ANIN" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-navy">Sistema de Infraestructuras</h1>
          <p className="text-brand-slate text-sm mt-1">Autoridad Nacional de Infraestructuras — Perú</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-brand-red/8 border border-brand-red/30 text-brand-red px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-brand-navy"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-navy mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-brand-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-navy/30 focus:border-brand-navy text-brand-navy"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red/85 text-white py-2.5 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Quick access */}
        <div className="mt-6 p-4 bg-brand-light/50 rounded-xl">
          <p className="text-xs font-semibold text-brand-slate uppercase tracking-wide mb-3">Acceso rápido</p>
          <div className="flex gap-2">
            {[
              { label: 'Admin',       key: 'admin',    color: 'bg-brand-navy text-white hover:bg-brand-navy/85' },
              { label: 'Operador',    key: 'operador', color: 'bg-brand-slate text-white hover:bg-brand-slate/85' },
              { label: 'Visualizador', key: 'viewer',  color: 'bg-brand-light text-brand-navy hover:bg-brand-light/70 border border-brand-light' },
            ].map(({ label, key, color }) => (
              <button
                key={key}
                type="button"
                onClick={() => fillCredentials(key)}
                className={`flex-1 text-xs px-2 py-1.5 rounded-lg font-medium transition-colors ${color}`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-slate/70 mt-2 text-center">Contraseña: 123456</p>
        </div>
      </div>
    </div>
  );
};
