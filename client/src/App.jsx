import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import useAuth from './store/auth';
import { RequireAuth } from './components/guards';
import { Loading } from './components/ui';
import { ConfirmProvider } from './components/confirm';
import PrivacyNotice from './components/PrivacyNotice';

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
const Terms = lazy(() => import('./pages/Legal/Terms'));
const Privacy = lazy(() => import('./pages/Legal/Privacy'));
const Cookies = lazy(() => import('./pages/Legal/Cookies'));
const Account = lazy(() => import('./pages/Booking/Account'));
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'));

function App() {
  const init = useAuth((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);

  return (
    <MotionConfig reducedMotion="user">
    <Router>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <ConfirmProvider>
      <Suspense fallback={<div className="min-h-screen bg-dark-bg"><Loading /></div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<ForgotPassword />} />
          <Route path="/restablecer" element={<ResetPassword />} />

          {/* Páginas legales: públicas, sin sesión */}
          <Route path="/terminos" element={<Terms />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />

          {/* La agenda solo se ve con sesión iniciada */}
          <Route path="/reservar" element={<RequireAuth><BookingPage /></RequireAuth>} />
          <Route path="/mis-turnos" element={<RequireAuth><MyAppointments /></RequireAuth>} />
          <Route path="/mi-cuenta" element={<RequireAuth><Account /></RequireAuth>} />

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
        <PrivacyNotice />
      </ConfirmProvider>
    </Router>
    </MotionConfig>
  );
}

export default App;
