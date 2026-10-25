'use client';

import { useId, useState } from 'react';

export default function PaymentProofPanel({ order, onSubmitted }) {
  const [proofImage, setProofImage] = useState('');
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const inputId = useId();
  const bank = order.business?.bankDetails || {};

  const selectFile = file => {
    setMessage('');
    setProofImage('');
    setFilename('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) {
      setMessage('Choose a JPG, PNG, or WebP image under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => { setProofImage(String(reader.result)); setFilename(file.name); };
    reader.onerror = () => setMessage('Could not read the image.');
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!proofImage) { setMessage('Select a payment proof image first.'); return; }
    setBusy(true);
    setMessage('');
    try {
      const response = await fetch(`/api/v1/orders/${order._id}/payment-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        body: JSON.stringify({ proofImage }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Upload failed.');
      setMessage('Proof submitted. The store will review your payment.');
      setProofImage('');
      setFilename('');
      onSubmitted?.();
    } catch (err) {
      setMessage(err.message || 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="space-y-4 text-sm text-[#253027]">
    <p>Transfer Rs. {order.totalAmount?.toLocaleString()} to {order.business?.storeName}, then upload a screenshot or receipt. Add this order ID as your payment reference:</p>
    <div className="flex items-center gap-3 rounded-xl bg-[#f7f5ef] p-3">
      <strong className="break-all">{order.orderId}</strong>
      <button type="button" className="ml-auto text-[#31543d] font-semibold" onClick={async () => { try { await navigator.clipboard.writeText(order.orderId); setMessage('Order ID copied.'); } catch { setMessage('Copy the order ID shown above.'); } }}>Copy</button>
    </div>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-xl border border-slate-200 p-4">
      {[['Bank', bank.bankName], ['Account name', bank.accountName], ['Account number', bank.accountNumber], ['IBAN', bank.iban]].map(([label, value]) => <div key={label}><dt className="text-slate-500">{label}</dt><dd className="font-semibold break-all">{value || 'Ask the store'}</dd></div>)}
    </dl>
    <div>
      <p className="font-semibold mb-2">Upload payment proof</p>
      <input id={inputId} className="sr-only peer" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => selectFile(e.target.files?.[0])} />
      <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 px-5 py-3 bg-[#e7eee5] border-2 border-[#31543d] text-[#31543d] font-bold rounded-xl hover:bg-[#dce8d9] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#31543d]">
        <span className="material-symbols-outlined" aria-hidden="true">upload_file</span>Choose receipt image
      </label>
      <p className="mt-2 text-xs text-slate-500">JPG, PNG or WebP, up to 2 MB.</p>
      {filename && <p className="mt-2 font-semibold">Selected: {filename}</p>}
      {proofImage && <img src={proofImage} alt="Selected payment proof preview" className="mt-3 max-h-48 max-w-full rounded-lg border border-slate-200 object-contain" />}
    </div>
    {message && <p role="status" className="font-semibold">{message}</p>}
    <button type="button" disabled={busy || !proofImage} onClick={submit} className="px-5 py-3 rounded-xl bg-[#31543d] text-white font-semibold disabled:opacity-50">{busy ? 'Uploading…' : 'Submit proof for review'}</button>
    <p className="text-xs text-slate-500">Your order stays payment pending until the store verifies the transfer.</p>
  </div>;
}
