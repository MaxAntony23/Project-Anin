import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="text-6xl mb-4">🔍</div>
    <h1 className="text-4xl font-bold text-gray-700 mb-2">404</h1>
    <p className="text-gray-500 mb-8">Página no encontrada</p>
    <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
      Volver al Dashboard
    </Link>
  </div>
);
