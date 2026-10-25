import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { Alert, Button, Card, Loading, PageTitle, StatusBadge } from '../../components/ui';
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
    <Card className="p-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="font-bebas text-xl tracking-wider">{fmtLong(a.date)} · <span className="text-cyan">{a.startTime}</span></p>
        <p className="text-muted text-sm">{a.serviceName} · {money(a.price)} · {a.paymentMethod}</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={a.status} />
        {canCancel && <Button variant="ghost" onClick={() => cancel(a._id)}>CANCELAR</Button>}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <main id="main" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-2">
          <PageTitle eyebrow="HISTORIAL" title="Mis turnos" />
          <Link to="/reservar" className="mb-6"><Button>NUEVO TURNO</Button></Link>
        </div>
        <Alert>{error}</Alert>
        {!items ? <Loading /> : (
          <>
            <h2 className="text-2xl font-bebas tracking-wider mb-3">Próximos</h2>
            <div className="space-y-3 mb-10">
              {upcoming.length ? upcoming.map((a) => <Row key={a._id} a={a} canCancel />) : <p className="text-muted text-sm">No tenés turnos próximos.</p>}
            </div>
            {history.length > 0 && (
              <>
                <h2 className="text-2xl font-bebas tracking-wider mb-3">Anteriores</h2>
                <div className="space-y-3">{history.map((a) => <Row key={a._id} a={a} />)}</div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
