import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

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
    if (rol === 'admin')     { setEmail('admin@test.com');        setPassword('123456'); }
    if (rol === 'operador')  { setEmail('operador@test.com');     setPassword('123456'); }
    if (rol === 'viewer')    { setEmail('visualizador@test.com'); setPassword('123456'); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏗️</div>
          <h1 className="text-2xl font-bold text-gray-800">Infrastructure System</h1>
          <p className="text-gray-500 text-sm mt-1">Autoridad Nacional de Infraestructuras — Perú</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="usuario@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Quick access */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Acceso rápido</p>
          <div className="flex gap-2">
            {[
              { label: 'Admin', key: 'admin', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
              { label: 'Operador', key: 'operador', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
              { label: 'Visualizador', key: 'viewer', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
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
          <p className="text-xs text-gray-400 mt-2 text-center">Contraseña: 123456</p>
        </div>
      </div>
    </div>
  );
};
