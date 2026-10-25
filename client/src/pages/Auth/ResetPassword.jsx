import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Field, inputCls } from '../../components/ui';
import AuthLayout from './AuthLayout';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.post('/auth/reset', { email, token, password });
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const invalid = !token || !email;

  return (
    <AuthLayout
      title="Nueva contraseña"
      subtitle="Elegí una contraseña nueva para tu cuenta."
      footer={<Link to="/login" className="text-cyan underline underline-offset-4 hover:text-white">Volver a ingresar</Link>}
    >
      {done ? (
        <Alert type="success">Listo, cambiaste tu contraseña. Ya podés ingresar con la nueva.</Alert>
      ) : invalid ? (
        <>
          <Alert>El enlace no es válido. Pedí uno nuevo.</Alert>
          <Link to="/recuperar" className="inline-flex items-center min-h-11 mt-3 text-cyan underline underline-offset-4 font-semibold">Pedir un enlace nuevo</Link>
        </>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Contraseña nueva" hint="Entre 8 y 72 caracteres.">
            <input type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Alert>{error}</Alert>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? 'GUARDANDO…' : 'GUARDAR CONTRASEÑA'}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
