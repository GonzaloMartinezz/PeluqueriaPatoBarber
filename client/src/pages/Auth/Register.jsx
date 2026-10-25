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
  const [form, setForm] = useState({ name: '', lastName: '', email: '', phone: '', password: '', acceptTerms: false });
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
      <p className="text-center text-sm text-gray-300 mt-3">
        Al continuar con Google aceptás los <Link to="/terminos" target="_blank" className="text-cyan underline underline-offset-4">Términos</Link> y la{' '}
        <Link to="/privacidad" target="_blank" className="text-cyan underline underline-offset-4">Política de Privacidad</Link>.
      </p>
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
        <label className="flex items-start gap-3 text-[15px] text-gray-200 leading-snug">
          <input type="checkbox" required checked={form.acceptTerms} onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })} className="mt-1 shrink-0" />
          <span>
            Leí y acepto los <Link to="/terminos" target="_blank" className="text-cyan underline underline-offset-4">Términos y condiciones</Link> y la{' '}
            <Link to="/privacidad" target="_blank" className="text-cyan underline underline-offset-4">Política de Privacidad</Link>, y autorizo el tratamiento de mis datos para gestionar mis turnos.
          </span>
        </label>
        <Alert>{error}</Alert>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? 'CREANDO…' : 'CREAR CUENTA'}</Button>
      </form>
    </AuthLayout>
  );
}
