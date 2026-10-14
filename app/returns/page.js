'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReturnsPage() {
  const router = useRouter();
  const [returns, setReturns] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/returns`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => response.json()).then(data => {
      if (data.success) setReturns(data.data.returns || []);
      else setError(data.message || 'Could not load returns.');
    }).catch(() => setError('Could not load returns.'));
  }, [router]);

  return <main className="min-h-screen bg-[#f8f6f3] p-6 md:p-12 text-[#272a32]">
    <div className="max-w-4xl mx-auto">
      <Link href="/orders" className="text-[#806794] text-sm">← My orders</Link>
      <h1 className="text-3xl font-bold mt-6 mb-2">My returns</h1>
      <p className="text-slate-500 mb-8">Track requests for delivered orders.</p>
      {error && <p role="alert" className="text-red-600 mb-4">{error}</p>}
      {!error && returns.length === 0 && <p>No return requests yet.</p>}
      <div className="space-y-4">{returns.map(item => <article key={item._id} className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex justify-between gap-4"><strong>{item.returnId}</strong><span className="capitalize">{item.status}</span></div>
        <p className="mt-2">{item.orderItem?.productName || 'Product'} · {item.business?.storeName || 'Store'}</p>
        <p className="text-sm text-slate-500">Order {item.order?.orderId} · {item.reason}</p>
      </article>)}</div>
    </div>
  </main>;
}
