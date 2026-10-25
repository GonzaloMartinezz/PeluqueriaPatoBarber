import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus } from 'lucide-react';
import ClientShell from '../../components/ClientShell';
import ThemeToggle from '../../components/ThemeToggle';
import { Alert, Button, Loading, StatusBadge } from '../../components/ui';
import { useConfirm } from '../../components/useConfirm';
import api, { errMsg } from '../../lib/api';
import { fmtLong, money, todayYmd } from '../../lib/dates';

export default function MyAppointments() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const confirm = useConfirm();

  const load = useCallback(() => {
    api.get('/appointments/mine').then(({ data }) => setItems(data.appointments)).catch((e) => setError(errMsg(e)));
  }, []);
  useEffect(load, [load]);

  const cancel = async (id) => {
    if (!(await confirm({ title: 'Cancelar turno', message: '¿Seguro que querés cancelar este turno? El horario quedará libre para otros clientes.', confirmLabel: 'CANCELAR TURNO', cancelLabel: 'NO, VOLVER' }))) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const today = todayYmd();
  const upcoming = items?.filter((a) => a.date >= today && ['pending', 'confirmed'].includes(a.status)).reverse();
  const history = items?.filter((a) => !upcoming.includes(a));

  const Row = ({ a, canCancel }) => (
    <li className="bg-dark-surface border border-dark-border rounded-3xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-sans font-extrabold text-lg leading-tight">
          {fmtLong(a.date)} · <span className="text-cyan">{a.startTime} hs</span>
        </p>
        <p className="text-gray-300 text-sm mt-0.5">{a.serviceName} · {money(a.price)} ARS · {a.paymentMethod}</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={a.status} />
        {canCancel && <Button variant="ghost" className="rounded-full" onClick={() => cancel(a._id)}>CANCELAR</Button>}
      </div>
    </li>
  );

  return (
    <ClientShell>
      <header className="sky-header rounded-b-[2rem] md:rounded-b-[2.5rem] px-5 pt-5 pb-7">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="md:hidden font-bebas text-2xl tracking-widest py-2">PATO BARBER</Link>
            <ThemeToggle onSky className="ml-auto" />
          </div>
          <p className="font-mono text-xs font-bold tracking-[0.25em] uppercase mt-3">Historial</p>
          <h1 className="font-sans font-extrabold text-4xl sm:text-5xl leading-tight" style={{ color: 'var(--on-sky)' }}>Mis turnos</h1>
        </div>
      </header>

      <div className="px-4 pt-6 max-w-3xl mx-auto pb-8">
        <Alert>{error}</Alert>
        {!items ? <Loading /> : (
          <>
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="font-sans font-extrabold text-2xl text-cyan">Próximos</h2>
              <Link to="/reservar">
                <Button className="rounded-full"><CalendarPlus size={18} aria-hidden="true" /> NUEVO TURNO</Button>
              </Link>
            </div>
            <ul className="space-y-3 mb-10">
              {upcoming.length ? upcoming.map((a) => <Row key={a._id} a={a} canCancel />) : (
                <li className="text-gray-300 text-sm bg-dark-surface border border-dashed border-dark-border rounded-3xl p-6 text-center">
                  No tenés turnos próximos. ¡Reservá el siguiente!
                </li>
              )}
            </ul>
            {history.length > 0 && (
              <>
                <h2 className="font-sans font-extrabold text-2xl text-cyan mb-3">Anteriores</h2>
                <ul className="space-y-3">{history.map((a) => <Row key={a._id} a={a} />)}</ul>
              </>
            )}
          </>
        )}
      </div>
    </ClientShell>
  );
}
