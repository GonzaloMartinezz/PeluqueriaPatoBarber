import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './store/auth';
import { RequireAuth } from './components/guards';
import { Loading } from './components/ui';
import { ConfirmProvider } from './components/confirm';

const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const BookingPage = lazy(() => import('./pages/Booking/BookingPage'));
const MyAppointments = lazy(() => import('./pages/Booking/MyAppointments'));
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminAgenda = lazy(() => import('./pages/Admin/AdminAgenda'));
const Clients = lazy(() => import('./pages/Admin/Clients'));
const ServicesAdmin = lazy(() => import('./pages/Admin/ServicesAdmin'));
const Settings = lazy(() => import('./pages/Admin/Settings'));

function App() {
  const init = useAuth((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <Router>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <ConfirmProvider>
      <Suspense fallback={<div className="min-h-screen bg-dark-bg"><Loading /></div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* La agenda solo se ve con sesión iniciada */}
          <Route path="/reservar" element={<RequireAuth><BookingPage /></RequireAuth>} />
          <Route path="/mis-turnos" element={<RequireAuth><MyAppointments /></RequireAuth>} />

          <Route path="/admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="agenda" element={<AdminAgenda />} />
            <Route path="clientes" element={<Clients />} />
            <Route path="servicios" element={<ServicesAdmin />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      </ConfirmProvider>
    </Router>
  );
}

export default App;
