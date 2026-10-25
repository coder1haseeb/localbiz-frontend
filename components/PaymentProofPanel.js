'use client';

import { useState } from 'react';

export default function PaymentProofPanel({ order, onSubmitted }) {
  const [proofImage, setProofImage] = useState('');
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const bank = order.business?.bankDetails || {};

  const selectFile = file => {
    setMessage('');
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
    <label className="block font-semibold">Upload payment proof
      <input className="block w-full mt-2 text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => selectFile(e.target.files?.[0])} />
    </label>
    {filename && <p className="text-slate-500">Selected: {filename}</p>}
    {message && <p role="status" className="font-semibold">{message}</p>}
    <button type="button" disabled={busy || !proofImage} onClick={submit} className="px-5 py-3 rounded-xl bg-[#31543d] text-white font-semibold disabled:opacity-50">{busy ? 'Uploading…' : 'Submit proof for review'}</button>
    <p className="text-xs text-slate-500">Your order stays payment pending until the store verifies the transfer.</p>
  </div>;
}
