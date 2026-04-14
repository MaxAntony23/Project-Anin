import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, AlertTriangle, LogOut, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '../store';
import logoAnin from '/logo-anin.webp';

const navLinks = [
  { to: '/dashboard',       label: 'Dashboard',        Icon: LayoutDashboard },
  { to: '/infraestructuras', label: 'Infraestructuras', Icon: Building2 },
  { to: '/incidentes',      label: 'Incidentes',        Icon: AlertTriangle },
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
    <nav className="bg-brand-header text-white shadow-lg">
      {/* Barra principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logoAnin} alt="ANIN" className="h-8 w-auto" />
          <span className="text-base font-bold tracking-tight hidden sm:inline">
            Sistema de Infraestructuras
          </span>
        </div>

        {/* Links de escritorio */}
        <div className="hidden md:flex gap-1">
          {navLinks.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-white/15 text-white'
                  : 'text-brand-light/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>

        {/* Usuario + logout (escritorio) + hamburger (móvil) */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right text-sm mr-1">
            <p className="font-medium leading-tight">{user?.nombreCompleto}</p>
            <p className="text-brand-light/60 text-xs">{user?.rol}</p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden md:flex items-center gap-1.5 bg-brand-red hover:bg-brand-red/85 px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </button>

          {/* Botón hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Menú"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4 pt-2 space-y-1">
          {/* Info usuario */}
          <div className="flex items-center gap-3 py-2 mb-2 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.nombreCompleto}</p>
              <p className="text-xs text-brand-light/60">{user?.rol}</p>
            </div>
          </div>

          {/* Links */}
          {navLinks.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-white/15 text-white'
                  : 'text-brand-light/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-2 bg-brand-red hover:bg-brand-red/85 px-3 py-2.5 rounded text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};
