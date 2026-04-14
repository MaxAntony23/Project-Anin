import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/infraestructuras', label: 'Infraestructuras' },
  { to: '/incidentes', label: 'Incidentes' },
];

export const Navbar: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <span className="text-base font-bold tracking-tight whitespace-nowrap">
          🏗️ <span className="hidden sm:inline">ANIN — Sistema de Infraestructuras</span>
          <span className="sm:hidden">ANIN</span>
        </span>

        {/* Links de escritorio */}
        <div className="hidden md:flex gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-2 rounded transition-colors text-sm font-medium ${
                location.pathname === to ? 'bg-blue-900' : 'hover:bg-blue-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Usuario + logout (escritorio) + hamburger (móvil) */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right text-sm mr-1">
            <p className="font-medium leading-tight">{user?.nombreCompleto}</p>
            <p className="text-blue-200 text-xs">{user?.rol}</p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:block bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Salir
          </button>

          {/* Botón hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded hover:bg-blue-600 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden border-t border-blue-600 px-4 pb-4 pt-2 space-y-1">
          {/* Info usuario */}
          <div className="flex items-center gap-3 py-2 mb-2 border-b border-blue-600">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.nombreCompleto?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.nombreCompleto}</p>
              <p className="text-xs text-blue-200">{user?.rol}</p>
            </div>
          </div>

          {/* Links */}
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                location.pathname === to ? 'bg-blue-900' : 'hover:bg-blue-600'
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 bg-red-500 hover:bg-red-600 px-3 py-2.5 rounded text-sm font-medium transition-colors text-left"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};
