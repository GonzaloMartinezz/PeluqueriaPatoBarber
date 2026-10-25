import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../store/auth';
import { errMsg } from '../../lib/api';
import { Alert, Button, Field, inputCls } from '../../components/ui';
import GoogleButton from '../../components/GoogleButton';
import AuthLayout, { OrDivider } from './AuthLayout';

export default function Login() {
  const login = useAuth((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const done = (user) => navigate(location.state?.from || (user.role === 'admin' ? '/admin' : '/reservar'), { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      done(await login(form.email, form.password));
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Ingresar"
      subtitle="Entrá para ver la agenda y reservar tu turno."
      footer={<>¿No tenés cuenta? <Link to="/register" state={location.state} className="text-cyan underline underline-offset-4 hover:text-white">Registrate</Link></>}
    >
      <GoogleButton onSuccess={done} onError={setError} />
      <p className="text-center text-sm text-gray-300 mt-3">
        Al continuar con Google aceptás los <Link to="/terminos" target="_blank" className="text-cyan underline underline-offset-4">Términos</Link> y la{' '}
        <Link to="/privacidad" target="_blank" className="text-cyan underline underline-offset-4">Política de Privacidad</Link>.
      </p>
      <OrDivider />
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input type="email" required autoComplete="email" className={inputCls} value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </Field>
        <Field label="Contraseña">
          <input type="password" required autoComplete="current-password" className={inputCls} value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </Field>
        <div className="text-right -mt-1">
          <Link to="/recuperar" className="inline-flex items-center min-h-11 text-cyan underline underline-offset-4 font-semibold text-[15px]">¿Olvidaste tu contraseña?</Link>
        </div>
        <Alert>{error}</Alert>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? 'INGRESANDO…' : 'INGRESAR'}</Button>
      </form>
    </AuthLayout>
  );
}
