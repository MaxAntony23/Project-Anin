import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { PrivateRoute, Navbar } from './components';
import { LoginPage, DashboardPage, NotFoundPage, InfrastructurasPage, IncidentesPage } from './pages';

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/infraestructuras"
          element={
            <PrivateRoute>
              <InfrastructurasPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/incidentes"
          element={
            <PrivateRoute>
              <IncidentesPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
