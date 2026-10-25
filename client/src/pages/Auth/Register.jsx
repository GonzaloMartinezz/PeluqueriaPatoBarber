import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../store/auth';
import { errMsg } from '../../lib/api';
import { Alert, Button, Field, inputCls } from '../../components/ui';
import GoogleButton from '../../components/GoogleButton';
import AuthLayout, { OrDivider } from './AuthLayout';

export default function Register() {
  const register = useAuth((s) => s.register);
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', lastName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const done = () => navigate(location.state?.from || '/reservar', { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      done();
    } catch (err) {
      const first = err.response?.data?.errors?.[0]?.message;
      setError(first || errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Con tu cuenta reservás turnos y ves tu historial."
      footer={<>¿Ya tenés cuenta? <Link to="/login" state={location.state} className="text-cyan underline underline-offset-4 hover:text-white">Ingresá</Link></>}
    >
      <GoogleButton onSuccess={done} onError={setError} />
      <OrDivider />
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombre"><input required className={inputCls} value={form.name} onChange={set('name')} autoComplete="given-name" /></Field>
          <Field label="Apellido"><input required className={inputCls} value={form.lastName} onChange={set('lastName')} autoComplete="family-name" /></Field>
        </div>
        <Field label="Email"><input type="email" required className={inputCls} value={form.email} onChange={set('email')} autoComplete="email" /></Field>
        <Field label="Teléfono / WhatsApp"><input type="tel" required pattern="[0-9+()\-\s]{6,20}" title="Solo números, espacios, + ( ) y -" maxLength={20} className={inputCls} value={form.phone} onChange={set('phone')} autoComplete="tel" /></Field>
        <Field label="Contraseña" hint="Entre 8 y 72 caracteres. Evitá claves comunes.">
          <input type="password" required minLength={8} maxLength={72} className={inputCls} value={form.password} onChange={set('password')} autoComplete="new-password" />
        </Field>
        <Alert>{error}</Alert>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? 'CREANDO…' : 'CREAR CUENTA'}</Button>
      </form>
    </AuthLayout>
  );
}
