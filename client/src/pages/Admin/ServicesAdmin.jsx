import { useEffect, useState } from 'react';
import useAutoRefresh from '../../lib/useAutoRefresh';
import { Clock, Pencil, Plus, Trash2 } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Field, Loading, Modal, PageTitle, inputCls } from '../../components/ui';
import { useConfirm } from '../../components/useConfirm';
import { money } from '../../lib/dates';

const EMPTY = { name: '', description: '', price: '', duration: 30, isPopular: false, isActive: true };

export default function ServicesAdmin() {
  const [services, setServices] = useState(null);
  const [editing, setEditing] = useState(null); // objeto con o sin _id
  const [error, setError] = useState('');
  const confirm = useConfirm();

  const load = () => api.get('/admin/services').then(({ data }) => setServices(data.services)).catch((e) => setError(errMsg(e)));
  useEffect(() => { load(); }, []);
  useAutoRefresh(load);

  const remove = async (s) => {
    if (!(await confirm({ title: 'Quitar servicio', message: `¿Quitar "${s.name}"? Los turnos anteriores se conservan.`, confirmLabel: 'QUITAR' }))) return;
    try {
      await api.delete(`/admin/services/${s._id}`);
      load();
    } catch (e) {
      setError(errMsg(e));
    }
  };

  return (
    <div>
      <PageTitle
        eyebrow="SERVICIOS"
        title="Servicios y precios"
        actions={<Button onClick={() => setEditing({ ...EMPTY })} className="rounded-full px-7"><Plus size={22} aria-hidden="true" /> NUEVO SERVICIO</Button>}
      >
        Esto es lo que el cliente elige al pedir un turno. La duración define cuánto tiempo bloquea en la agenda.
      </PageTitle>
      <div className="mb-4"><Alert>{error}</Alert></div>

      {!services ? <Loading /> : (
        <ul className="grid md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {services.map((s) => (
            <li key={s._id}>
              <article className={`h-full flex flex-col bg-dark-surface border rounded-3xl p-7 ${s.isActive ? 'border-dark-border' : 'border-dashed border-dark-border'}`}>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-sans font-extrabold text-2xl leading-tight">{s.name}</h2>
                  <div className="flex flex-wrap justify-end gap-2">
                    {s.isPopular && <span className="text-xs font-bold bg-cyan text-black rounded-full px-3 py-1">POPULAR</span>}
                    {!s.isActive && <span className="text-xs font-bold border border-white/30 rounded-full px-3 py-1">OCULTO</span>}
                  </div>
                </div>
                <p className="font-sans font-extrabold text-5xl text-cyan mt-5">{money(s.price)}</p>
                <p className="flex items-center gap-2 text-gray-300 text-lg mt-2"><Clock size={20} aria-hidden="true" /> {s.duration} minutos</p>
                <p className="text-gray-300 text-base mt-4 flex-1 min-h-[3rem]">{s.description || <span className="text-muted">Sin descripción</span>}</p>
                <div className="mt-6 pt-5 border-t border-dark-border flex gap-3">
                  <Button variant="ghost" onClick={() => setEditing(s)} className="flex-1"><Pencil size={18} aria-hidden="true" /> EDITAR</Button>
                  {s.isActive && (
                    <Button variant="ghost" onClick={() => remove(s)} className="!border-busy/60 !text-rose-200 hover:!bg-busy/10"><Trash2 size={18} aria-hidden="true" /> QUITAR</Button>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <ServiceModal key={editing?._id || (editing ? 'nuevo' : 'ninguno')} service={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
    </div>
  );
}

function ServiceModal({ service, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...service });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!service) return null;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { ...form, price: Number(form.price), duration: Number(form.duration) };
      if (service._id) await api.put(`/admin/services/${service._id}`, body);
      else await api.post('/admin/services', body);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={service._id ? 'Editar servicio' : 'Nuevo servicio'}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Nombre"><input className={inputCls} value={form.name} onChange={set('name')} required /></Field>
        <Field label="Descripción"><textarea className={inputCls} rows={2} value={form.description || ''} onChange={set('description')} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio ($)"><input type="number" min="0" className={inputCls} value={form.price} onChange={set('price')} required /></Field>
          <Field label="Duración (min)"><input type="number" min="10" step="5" className={inputCls} value={form.duration} onChange={set('duration')} required /></Field>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isPopular} onChange={set('isPopular')} /> Marcar como popular</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!form.isActive} onChange={set('isActive')} /> Visible para los clientes</label>
        <Alert>{error}</Alert>
        <Button type="submit" className="w-full" disabled={busy}>{busy ? 'GUARDANDO…' : 'GUARDAR'}</Button>
      </form>
    </Modal>
  );
}
