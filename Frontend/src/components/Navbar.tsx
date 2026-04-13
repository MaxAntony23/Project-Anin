import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export const Navbar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tight">
            🏗️ ANIN - Sistema de Infraestructuras
          </span>
          <div className="flex gap-1">
            <Link to="/dashboard" className="hover:bg-blue-600 px-3 py-2 rounded transition-colors text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/infraestructuras" className="hover:bg-blue-600 px-3 py-2 rounded transition-colors text-sm font-medium">
              Infraestructuras
            </Link>
            <Link to="/incidentes" className="hover:bg-blue-600 px-3 py-2 rounded transition-colors text-sm font-medium">
              Incidentes
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right text-sm">
            <p className="font-medium">{user?.nombreCompleto}</p>
            <p className="text-blue-200 text-xs">{user?.rol}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
};
