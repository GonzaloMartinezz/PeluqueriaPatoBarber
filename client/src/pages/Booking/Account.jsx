import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Download, LogOut, ShieldCheck, Trash2 } from 'lucide-react';
import ClientShell from '../../components/ClientShell';
import ThemeToggle from '../../components/ThemeToggle';
import { Alert, Button, Field, inputCls } from '../../components/ui';
import { useConfirm } from '../../components/useConfirm';
import api, { errMsg } from '../../lib/api';
import useAuth from '../../store/auth';

const Section = ({ title, children }) => (
  <section className="bg-dark-surface border border-dark-border rounded-3xl p-5 sm:p-6 mb-5">
    <h2 className="font-sans font-extrabold text-2xl text-cyan mb-4">{title}</h2>
    {children}
  </section>
);

function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name || '', lastName: user.lastName || '', phone: user.phone || '' });
  const [msg, setMsg] = useState({ type: 'error', text: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await updateProfile(form);
      setMsg({ type: 'success', text: 'Datos actualizados.' });
    } catch (err) {
      setMsg({ type: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Mis datos">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Nombre"><input required maxLength={60} autoComplete="given-name" className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Apellido"><input maxLength={60} autoComplete="family-name" className={inputCls} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
        </div>
        <Field label="Teléfono"><input type="tel" autoComplete="tel" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <p className="text-muted text-sm">Email: {user.email} (no se puede cambiar)</p>
        <Alert type={msg.type}>{msg.text}</Alert>
        <Button type="submit" disabled={busy}>{busy ? 'GUARDANDO…' : 'GUARDAR'}</Button>
      </form>
    </Section>
  );
}

function Password() {
  const changePassword = useAuth((s) => s.changePassword);
  const [form, setForm] = useState({ current: '', next: '' });
  const [msg, setMsg] = useState({ type: 'error', text: '' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await changePassword(form.current, form.next);
      setForm({ current: '', next: '' });
      setMsg({ type: 'success', text: 'Contraseña actualizada. Las demás sesiones abiertas se cerraron.' });
    } catch (err) {
      setMsg({ type: 'error', text: errMsg(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Cambiar contraseña">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Contraseña actual"><input type="password" required autoComplete="current-password" className={inputCls} value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} /></Field>
        <Field label="Contraseña nueva" hint="Entre 8 y 72 caracteres."><input type="password" required minLength={8} maxLength={72} autoComplete="new-password" className={inputCls} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} /></Field>
        <Alert type={msg.type}>{msg.text}</Alert>
        <Button type="submit" disabled={busy}>{busy ? 'GUARDANDO…' : 'CAMBIAR CONTRASEÑA'}</Button>
      </form>
    </Section>
  );
}

export default function Account() {
  const { user, logoutAll, deleteAccount } = useAuth();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setError('');
    try {
      const { data } = await api.get('/auth/me/export', { responseType: 'blob' });
      const url = URL.createObjectURL(data);
      const a = Object.assign(document.createElement('a'), { href: url, download: 'mis-datos-pato-barber.json' });
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const closeAll = async () => {
    if (!(await confirm({ title: 'Cerrar todas las sesiones', message: 'Se va a cerrar tu sesión en todos los dispositivos, incluido este. Después tenés que volver a ingresar.', confirmLabel: 'CERRAR SESIONES', cancelLabel: 'VOLVER' }))) return;
    try {
      await logoutAll();
      navigate('/login', { replace: true });
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const remove = async (e) => {
    e.preventDefault();
    if (!(await confirm({ title: 'Eliminar mi cuenta', message: 'Se borran tus datos personales y tus turnos pendientes dejan de estar a tu nombre. No se puede deshacer.', confirmLabel: 'ELIMINAR', cancelLabel: 'VOLVER' }))) return;
    setBusy(true);
    try {
      await deleteAccount();
      navigate('/', { replace: true });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <ClientShell>
      <header className="sky-header rounded-b-[2rem] md:rounded-b-[2.5rem] px-5 pt-5 pb-7">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="md:hidden font-bebas text-2xl tracking-widest py-2">PATO BARBER</Link>
            <ThemeToggle onSky className="ml-auto" />
          </div>
          <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase mt-3">Tu perfil</p>
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl leading-tight" style={{ color: 'var(--on-sky)' }}>Mi cuenta</h1>
        </div>
      </header>

      <div className="px-4 pt-6 max-w-3xl mx-auto pb-8">
        <Alert>{error}</Alert>
        <div className={error ? 'mt-4' : ''}>
          <Profile />
          {user.provider === 'email' && <Password />}

          <Section title="Privacidad y seguridad">
            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={download}><Download size={18} aria-hidden="true" /> DESCARGAR MIS DATOS</Button>
              <Button variant="ghost" onClick={closeAll}><LogOut size={18} aria-hidden="true" /> CERRAR SESIÓN EN TODOS LADOS</Button>
            </div>
            <p className="text-muted text-sm mt-4 flex items-start gap-2">
              <ShieldCheck size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
              <span>Leé cómo cuidamos tus datos en la <Link to="/privacidad" className="text-cyan underline underline-offset-4">Política de Privacidad</Link>.</span>
            </p>
          </Section>

          {user.role !== 'admin' && (
            <Section title="Eliminar mi cuenta">
              <p className="text-gray-300 mb-4">Borramos tus datos personales (nombre, email, teléfono y comentarios). Tus turnos pasados quedan sin ningún dato que te identifique. Esta acción no se puede deshacer.</p>
              <form onSubmit={remove} className="space-y-4">
                <Field label="Para confirmar, escribí ELIMINAR">
                  <input className={inputCls} value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
                </Field>
                <Button type="submit" variant="danger" disabled={typed !== 'ELIMINAR' || busy}><Trash2 size={18} aria-hidden="true" /> ELIMINAR MI CUENTA</Button>
              </form>
            </Section>
          )}
        </div>
      </div>
    </ClientShell>
  );
}
