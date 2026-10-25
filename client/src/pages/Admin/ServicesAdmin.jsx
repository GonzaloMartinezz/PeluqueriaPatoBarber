import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import api, { errMsg } from '../../lib/api';
import { Alert, Button, Card, Field, Loading, Modal, PageTitle, inputCls } from '../../components/ui';
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageTitle eyebrow="SERVICIOS" title="Qué ofrecés y a qué precio">
          Esto es lo que el cliente elige al pedir un turno. La duración define cuántas franjas ocupa.
        </PageTitle>
        <Button onClick={() => setEditing({ ...EMPTY })}><Plus size={14} className="inline -mt-1 mr-1" />NUEVO SERVICIO</Button>
      </div>
      <Alert>{error}</Alert>

      {!services ? <Loading /> : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s._id} className={`p-5 ${s.isActive ? '' : '!border-dashed'}`}>
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bebas tracking-wider">{s.name}</h2>
                <span className="text-cyan font-mono font-bold">{money(s.price)}</span>
              </div>
              <p className="text-muted text-sm my-2 min-h-[2.5rem]">{s.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-muted font-mono text-[11px] tracking-widest">
                  {s.duration} MIN {s.isPopular && '· POPULAR'} {!s.isActive && '· OCULTO'}
                </span>
                <span className="flex gap-3">
                  <button onClick={() => setEditing(s)} className="w-11 h-11 flex items-center justify-center text-gray-300 hover:text-cyan" aria-label={`Editar ${s.name}`}><Pencil size={17} aria-hidden="true" /></button>
                  {s.isActive && <button onClick={() => remove(s)} className="w-11 h-11 flex items-center justify-center text-gray-300 hover:text-busy" aria-label={`Quitar ${s.name}`}><Trash2 size={17} aria-hidden="true" /></button>}
                </span>
              </div>
            </Card>
          ))}
        </div>
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
