'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function AdminRecordActions({ record, kind, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const dialogRef = useRef(null);
  const titleId = useId();
  const store = kind === 'businesses';
  const fields = store ? ['storeName', 'description', 'address', 'city', 'phone'] : ['fullName', 'email', 'phone', ...(record.role === 'customer' ? ['city'] : [])];
  const labels = { storeName: 'Store name', fullName: 'Full name', description: 'Description', address: 'Address', city: 'City', phone: 'Phone', email: 'Email' };

  useEffect(() => {
    if (!editing) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [editing]);

  async function mutate(method, body) {
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/v1/admin/${kind}/${record._id}`, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not save changes.');
      setEditing(false);
      setMessage(method === 'DELETE' ? 'Deleted.' : 'Changes saved.');
      await onSaved();
    } catch (err) { setMessage(err.message || 'Could not save changes.'); }
    finally { setBusy(false); }
  }

  return <div className="space-y-2">
    <div className="flex flex-wrap gap-2">
      <button type="button" disabled={busy} onClick={() => { setValues(Object.fromEntries(fields.map(field => [field, record[field] || '']))); setMessage(''); setEditing(true); }} className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-[#31543d] disabled:opacity-50">Edit</button>
      {store && <>
        {record.approvalStatus === 'approved' && <button type="button" disabled={busy} onClick={() => mutate('PUT', { isActive: !record.isActive })} className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 disabled:opacity-50">{record.isActive ? 'Deactivate' : 'Activate'}</button>}
        <button type="button" disabled={busy} onClick={() => { if (window.confirm(`Permanently delete “${record.storeName}”? Stores with products or orders must be deactivated instead.`)) mutate('DELETE'); }} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50">Delete</button>
      </>}
    </div>
    {message && <p role="status" className="text-sm text-[#31543d]">{message}</p>}
    {editing && createPortal(<dialog ref={dialogRef} aria-labelledby={titleId} className="admin-edit-dialog" onCancel={event => { event.preventDefault(); if (!busy) setEditing(false); }}>
      <form onSubmit={event => { event.preventDefault(); mutate('PUT', values); }} className="admin-edit-form">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <h2 id={titleId} className="text-xl font-bold">Edit {store ? 'store' : 'user'}</h2>
          <button type="button" disabled={busy} aria-label="Close edit dialog" onClick={() => setEditing(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-50"><span className="material-symbols-outlined" aria-hidden="true">close</span></button>
        </header>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-6 py-5">
        {fields.map((field, index) => <label key={field} className="block text-sm font-semibold">{labels[field]}
          {field === 'description' ? <textarea value={values[field]} maxLength={5000} onChange={event => setValues(previous => ({ ...previous, [field]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 p-2" />
            : <input autoFocus={index === 0} required maxLength={field === 'address' ? 500 : 200} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} pattern={field === 'phone' ? '[0-9]{10,}' : undefined} value={values[field]} onChange={event => setValues(previous => ({ ...previous, [field]: event.target.value }))} className="mt-1 w-full rounded-lg border border-slate-300 p-2" />}
        </label>)}
        {message && <p role="alert" className="text-sm text-red-700">{message}</p>}
        </div>
        <footer className="flex shrink-0 flex-wrap justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button type="button" disabled={busy} onClick={() => setEditing(false)} className="rounded-lg border px-4 py-2">Cancel</button>
          <button type="submit" disabled={busy} className="rounded-lg bg-[#31543d] px-4 py-2 text-white disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button>
        </footer>
      </form>
    </dialog>, document.body)}
  </div>;
}
