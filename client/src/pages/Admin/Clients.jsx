import { useEffect, useState } from 'react';
import { Mail, Phone, Search } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Card, Loading, PageTitle, inputCls } from '../../components/ui';
import { useConfirm } from '../../components/useConfirm';
import { format } from 'date-fns';
import { fmtDate, money } from '../../lib/dates';

// Las fechas con hora vienen en UTC: se muestran en la hora local del navegador.
const day = (iso) => format(new Date(iso), 'dd/MM/yyyy');

function Avatar({ c }) {
  return c.avatar ? (
    <img src={c.avatar} alt="" referrerPolicy="no-referrer" className="w-10 h-10 rounded-full shrink-0" />
  ) : (
    <span
      aria-hidden="true"
      className="w-10 h-10 rounded-full bg-cyan-dim border border-dark-border text-cyan flex items-center justify-center font-bebas text-xl shrink-0"
    >
      {c.name[0]}
    </span>
  );
}

const Blocked = () => (
  <span className="ml-2 align-middle text-xs font-mono tracking-widest text-rose-200 border border-busy/50 px-1.5 rounded-sm">BLOQUEADO</span>
);

function BlockButton({ c, onToggle }) {
  return (
    <button
      onClick={() => onToggle(c)}
      className="min-h-11 px-3 text-xs font-mono tracking-widest text-gray-300 hover:text-white border border-white/15 rounded-sm hover:border-cyan"
    >
      {c.isActive ? 'BLOQUEAR' : 'DESBLOQUEAR'}
    </button>
  );
}

export default function Clients() {
  const [clients, setClients] = useState(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState('');
  const confirm = useConfirm();

  useEffect(() => {
    // Pequeña espera para no pedir en cada tecla.
    const t = setTimeout(() => {
      api.get('/admin/clients', { params: { q } })
        .then(({ data }) => setClients(data.clients))
        .catch((e) => setError(errMsg(e)));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  const toggle = async (c) => {
    if (c.isActive && !(await confirm({ title: 'Bloquear cliente', message: `¿Bloquear a ${c.name} ${c.lastName}? No podrá ingresar ni reservar.`, confirmLabel: 'BLOQUEAR' }))) return;
    try {
      await api.patch(`/admin/clients/${c.id}`, { isActive: !c.isActive });
      setClients((list) => list.map((x) => (x.id === c.id ? { ...x, isActive: !c.isActive } : x)));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="CLIENTES" title="Personas que ingresaron a la web">
          {clients ? `${clients.length} registrados` : ' '}
        </PageTitle>
        <div className="relative w-full sm:w-80 mb-6">
          <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            aria-label="Buscar cliente"
            className={`${inputCls} pl-9`}
            placeholder="Buscar nombre o email"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <Alert>{error}</Alert>

      {!clients ? <Loading /> : clients.length === 0 ? (
        <Card className="p-10 text-center text-muted">No hay clientes que coincidan.</Card>
      ) : (
        <>
          {/* Celular y tablet: una tarjeta por cliente */}
          <ul className="space-y-3 lg:hidden">
            {clients.map((c) => (
              <li key={c.id}>
                <Card className={`p-4 ${c.isActive ? '' : '!border-dashed'}`}>
                  <div className="flex items-start gap-3">
                    <Avatar c={c} />
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-semibold truncate">{c.name} {c.lastName}{!c.isActive && <Blocked />}</p>
                      <p className="text-gray-300 text-sm flex items-center gap-1.5 truncate"><Mail size={13} aria-hidden="true" className="shrink-0 text-muted" />{c.email}</p>
                      <p className="text-gray-300 text-sm flex items-center gap-1.5"><Phone size={13} aria-hidden="true" className="shrink-0 text-muted" />{c.phone || 'Sin teléfono'}</p>
                    </div>
                    {c.viaGoogle && <span className="text-xs font-mono text-muted border border-white/15 px-1.5 rounded-sm">GOOGLE</span>}
                  </div>
                  <dl className="grid grid-cols-3 gap-2 mt-4 text-sm">
                    <div><dt className="text-muted text-xs font-mono uppercase">Turnos</dt><dd className="text-white font-bold">{c.appointments - c.cancelled}</dd></div>
                    <div><dt className="text-muted text-xs font-mono uppercase">Gastado</dt><dd className="font-mono">{money(c.spent)}</dd></div>
                    <div><dt className="text-muted text-xs font-mono uppercase">Registro</dt><dd>{day(c.createdAt)}</dd></div>
                  </dl>
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-dark-border">
                    <span className="text-muted text-xs">Último ingreso: {c.lastLoginAt ? day(c.lastLoginAt) : '—'}</span>
                    <BlockButton c={c} onToggle={toggle} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          {/* Escritorio: tabla */}
          <Card className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Clientes registrados</caption>
              <thead>
                <tr className="text-left text-muted font-mono text-xs tracking-widest uppercase border-b border-dark-border">
                  {['Nombre y apellido', 'Contacto', 'Registro', 'Último ingreso', 'Turnos', 'Gastado'].map((h) => (
                    <th key={h} scope="col" className="px-4 py-3 font-normal">{h}</th>
                  ))}
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-dark-border/60 hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar c={c} />
                        <div>
                          <p className="text-white">{c.name} {c.lastName}{!c.isActive && <Blocked />}</p>
                          {c.viaGoogle && <span className="text-xs font-mono text-muted tracking-widest">GOOGLE</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      <p>{c.email}</p>
                      <p className="text-muted">{c.phone || 'Sin teléfono'}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{day(c.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-300">{c.lastLoginAt ? day(c.lastLoginAt) : '—'}</td>
                    <td className="px-4 py-3">
                      <b className="text-white">{c.appointments - c.cancelled}</b>
                      {c.cancelled > 0 && <span className="text-muted text-xs"> (+{c.cancelled} canc.)</span>}
                      {c.lastAppointment && <p className="text-muted text-xs">Último: {fmtDate(c.lastAppointment)}</p>}
                    </td>
                    <td className="px-4 py-3 font-mono">{money(c.spent)}</td>
                    <td className="px-4 py-3 text-right"><BlockButton c={c} onToggle={toggle} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  );
}
