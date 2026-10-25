import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Field, inputCls } from '../../components/ui';
import AuthLayout from './AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/forgot', { email });
      setSent(data.message);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Ingresá tu email y te enviamos un enlace para crear una contraseña nueva."
      footer={<Link to="/login" className="text-cyan underline underline-offset-4 hover:text-white">Volver a ingresar</Link>}
    >
      {sent ? (
        <Alert type="success">{sent}</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email">
            <input type="email" required autoComplete="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Alert>{error}</Alert>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? 'ENVIANDO…' : 'ENVIAR ENLACE'}</Button>
        </form>
      )}
    </AuthLayout>
  );
}
