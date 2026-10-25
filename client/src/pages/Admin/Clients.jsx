import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Search, Trash2, UserCheck, UserPlus, Users } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Loading, PageTitle, inputCls } from '../../components/ui';
import { useConfirm } from '../../components/useConfirm';
import { fmtDate, money } from '../../lib/dates';

// Las fechas con hora vienen en UTC: se muestran en la hora local del navegador.
const day = (iso) => format(new Date(iso), 'dd/MM/yyyy');
const panel = 'bg-dark-surface border border-dark-border rounded-3xl';

function Avatar({ c, size = 'w-12 h-12 text-2xl' }) {
  return c.avatar ? (
    <img src={c.avatar} alt="" referrerPolicy="no-referrer" className={`${size} rounded-full shrink-0`} />
  ) : (
    <span aria-hidden="true" className={`${size} rounded-full bg-cyan-dim border border-cyan/30 text-cyan flex items-center justify-center font-bebas shrink-0`}>
      {c.name[0]}
    </span>
  );
}

const Blocked = () => (
  <span className="ml-2 align-middle text-xs font-bold tracking-wide text-rose-200 border border-busy/50 px-2 py-0.5 rounded-full">BLOQUEADO</span>
);

function BlockButton({ c, onToggle }) {
  return (
    <button
      onClick={() => onToggle(c)}
      className="min-h-11 px-5 text-sm font-bold text-gray-200 hover:text-white border border-white/20 rounded-xl hover:border-cyan transition-colors"
    >
      {c.isActive ? 'Bloquear' : 'Desbloquear'}
    </button>
  );
}

function DeleteButton({ c, onDelete }) {
  return (
    <button
      onClick={() => onDelete(c)}
      className="min-h-11 px-4 text-sm font-bold text-rose-200 hover:text-white border border-busy/40 rounded-xl hover:border-busy transition-colors inline-flex items-center gap-2"
    >
      <Trash2 size={16} aria-hidden="true" /> Eliminar datos
    </button>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className={`${panel} p-5 flex items-center gap-4`}>
      <span aria-hidden="true" className="w-14 h-14 rounded-2xl bg-cyan-dim text-cyan flex items-center justify-center"><Icon size={26} /></span>
      <div>
        <p className="text-gray-300 font-semibold text-sm">{label}</p>
        <p className="font-sans font-extrabold text-3xl leading-tight">{value}</p>
      </div>
    </div>
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

  const stats = useMemo(() => {
    if (!clients) return null;
    const month = new Date().toISOString().slice(0, 7);
    return {
      total: clients.length,
      nuevos: clients.filter((c) => c.createdAt.startsWith(month)).length,
      conTurnos: clients.filter((c) => c.appointments - c.cancelled > 0).length,
    };
  }, [clients]);

  const toggle = async (c) => {
    if (c.isActive && !(await confirm({ title: 'Bloquear cliente', message: `¿Bloquear a ${c.name} ${c.lastName}? No podrá ingresar ni reservar.`, confirmLabel: 'BLOQUEAR' }))) return;
    try {
      await api.patch(`/admin/clients/${c.id}`, { isActive: !c.isActive });
      setClients((list) => list.map((x) => (x.id === c.id ? { ...x, isActive: !c.isActive } : x)));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  const erase = async (c) => {
    if (!(await confirm({ title: 'Eliminar datos del cliente', message: `Se borran los datos personales de ${c.name} ${c.lastName} y su cuenta. Sus turnos quedan en el historial sin nombre ni teléfono. No se puede deshacer. Usalo cuando el cliente te pide que borres sus datos.`, confirmLabel: 'ELIMINAR DATOS' }))) return;
    try {
      await api.delete(`/admin/clients/${c.id}`);
      setClients((list) => list.filter((x) => x.id !== c.id));
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <PageTitle
        eyebrow="CLIENTES"
        title="Clientes"
        actions={
          <div className="relative w-full sm:w-96">
            <Search size={20} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input type="search" aria-label="Buscar cliente" className={`${inputCls} pl-12`} placeholder="Buscar por nombre o email" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        }
      >
        Todas las personas que se registraron o ingresaron con Google, con su historial de turnos.
      </PageTitle>

      <div className="mb-4"><Alert>{error}</Alert></div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3 mb-6">
          <Stat icon={Users} label="Clientes registrados" value={stats.total} />
          <Stat icon={UserPlus} label="Nuevos este mes" value={stats.nuevos} />
          <Stat icon={UserCheck} label="Con turnos reservados" value={stats.conTurnos} />
        </div>
      )}

      {!clients ? <Loading /> : clients.length === 0 ? (
        <div className={`${panel} p-14 text-center`}>
          <p className="font-sans font-extrabold text-2xl">{q ? 'No hay clientes que coincidan' : 'Todavía no hay clientes'}</p>
          <p className="text-gray-300 mt-2 text-lg">
            {q ? 'Probá con otro nombre o email.' : 'Apenas alguien se registre o entre con Google, va a aparecer acá.'}
          </p>
        </div>
      ) : (
        <>
          {/* Celular y tablet: una tarjeta por cliente */}
          <ul className="space-y-4 lg:hidden">
            {clients.map((c) => (
              <li key={c.id}>
                <div className={`${panel} p-5 ${c.isActive ? '' : '!border-dashed'}`}>
                  <div className="flex items-start gap-4">
                    <Avatar c={c} />
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-extrabold text-lg">{c.name} {c.lastName}{!c.isActive && <Blocked />}</p>
                      <p className="text-gray-300 flex items-center gap-2 truncate"><Mail size={15} aria-hidden="true" className="shrink-0 text-muted" />{c.email}</p>
                      <p className="text-gray-300 flex items-center gap-2"><Phone size={15} aria-hidden="true" className="shrink-0 text-muted" />{c.phone || 'Sin teléfono'}</p>
                    </div>
                    {c.viaGoogle && <span className="text-xs font-bold text-muted border border-white/20 px-2 py-0.5 rounded-full">GOOGLE</span>}
                  </div>
                  <dl className="grid grid-cols-3 gap-3 mt-5">
                    <div><dt className="text-muted text-sm">Turnos</dt><dd className="font-extrabold text-lg">{c.appointments - c.cancelled}</dd></div>
                    <div><dt className="text-muted text-sm">Gastado</dt><dd className="font-extrabold text-lg">{money(c.spent)}</dd></div>
                    <div><dt className="text-muted text-sm">Registro</dt><dd className="font-semibold">{day(c.createdAt)}</dd></div>
                  </dl>
                  <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-dark-border">
                    <span className="text-muted text-sm">Último ingreso: {c.lastLoginAt ? day(c.lastLoginAt) : '—'}</span>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <BlockButton c={c} onToggle={toggle} />
                      <DeleteButton c={c} onDelete={erase} />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Escritorio: tabla */}
          <div className={`${panel} hidden lg:block overflow-hidden`}>
            <table className="w-full text-base">
              <caption className="sr-only">Clientes registrados</caption>
              <thead>
                <tr className="text-left text-gray-300 text-sm font-bold bg-dark-surface2/60">
                  {['Cliente', 'Contacto', 'Registro', 'Último ingreso', 'Turnos', 'Gastado'].map((h) => (
                    <th key={h} scope="col" className={`px-5 py-4 whitespace-nowrap ${h === 'Último ingreso' ? 'hidden 2xl:table-cell' : ''}`}>{h}</th>
                  ))}
                  <th scope="col" className="px-5 py-4"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-t border-dark-border hover:bg-cyan-dim/50 transition-colors">
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-4">
                        <Avatar c={c} />
                        <div>
                          <p className="text-white font-bold text-lg leading-tight whitespace-nowrap">{c.name} {c.lastName}{!c.isActive && <Blocked />}</p>
                          {c.viaGoogle && <span className="text-xs font-bold text-muted">Ingresó con Google</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-gray-200">
                      <p className="break-all">{c.email}</p>
                      <p className="text-muted">{c.phone || 'Sin teléfono'}</p>
                    </td>
                    <td className="px-5 py-5 text-gray-200 whitespace-nowrap">{day(c.createdAt)}</td>
                    <td className="px-5 py-5 text-gray-200 whitespace-nowrap hidden 2xl:table-cell">{c.lastLoginAt ? day(c.lastLoginAt) : '—'}</td>
                    <td className="px-5 py-5 whitespace-nowrap">
                      <b className="text-white text-lg">{c.appointments - c.cancelled}</b>
                      {c.cancelled > 0 && <span className="text-muted text-sm"> (+{c.cancelled} canc.)</span>}
                      {c.lastAppointment && <p className="text-muted text-sm">Último: {fmtDate(c.lastAppointment)}</p>}
                    </td>
                    <td className="px-5 py-5 font-extrabold text-lg whitespace-nowrap">{money(c.spent)}</td>
                    <td className="px-5 py-5 text-right"><div className="flex gap-2 justify-end"><BlockButton c={c} onToggle={toggle} /><DeleteButton c={c} onDelete={erase} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
