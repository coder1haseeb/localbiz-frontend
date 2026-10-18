'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const [message, setMessage] = useState('Checking payment status…');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const paymentId = sessionStorage.getItem('pendingPaymentId');
    if (!token || !paymentId) { setMessage('Open your orders to check the payment status.'); return; }
    let stopped = false;
    let timer;
    const started = Date.now();
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/v1/payments/${paymentId}/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message);
        if (stopped) return;
        if (data.data.status === 'paid') { setMessage('Payment confirmed.'); return; }
        if (data.data.status === 'failed') { setMessage('Payment failed. Please check your order.'); return; }
        if (Date.now() - started < 30000) {
          timer = setTimeout(checkStatus, 2000);
        } else {
          setMessage('Payment is pending confirmation. Check your order again shortly.');
        }
      } catch {
        if (!stopped) setMessage('Could not confirm payment yet. Check your order history.');
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
