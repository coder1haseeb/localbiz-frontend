'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const [message, setMessage] = useState('Checking payment status…');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const paymentId = sessionStorage.getItem('pendingPaymentId');
    const tracker = new URLSearchParams(window.location.search).get('tracker');
    const statusPath = tracker && /^track_[a-zA-Z0-9-]+$/.test(tracker)
      ? `/api/v1/payments/safepay/tracker/${encodeURIComponent(tracker)}/status`
      : paymentId ? `/api/v1/payments/${paymentId}/status` : null;
    if (!token || !statusPath) { setMessage('Open your orders to check the payment status.'); return; }
    let stopped = false;
    let timer;
    const deadline = Date.now() + 35000;
    const checkStatus = async () => {
      try {
        const response = await fetch(statusPath, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
          signal: AbortSignal.timeout(12000),
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message);
        if (stopped) return;
        if (data.data.status === 'paid') {
          sessionStorage.removeItem('pendingPaymentId');
          setMessage('Payment confirmed.');
          return;
        }
        if (data.data.status === 'failed') { setMessage('Payment failed. Please check your order.'); return; }
        if (Date.now() < deadline) {
          timer = setTimeout(checkStatus, 2000);
        } else {
          setMessage('Payment is pending confirmation. Check your order again shortly.');
        }
      } catch {
        if (stopped) return;
        if (Date.now() < deadline) timer = setTimeout(checkStatus, 2000);
        else setMessage('Could not confirm payment yet. Check your order history.');
      }
    };
    checkStatus();
    return () => { stopped = true; clearTimeout(timer); };
  }, []);

  return <main className="min-h-screen bg-[#f7f5ef] flex items-center justify-center p-6">
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-4">Payment status</h1>
      <p role="status" className="text-slate-600 mb-6">{message}</p>
      <Link href="/orders" className="text-[#31543d] font-semibold">View my orders →</Link>
    </div>
  </main>;
}
