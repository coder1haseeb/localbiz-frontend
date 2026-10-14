'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const [message, setMessage] = useState('Checking payment status…');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const paymentId = sessionStorage.getItem('pendingPaymentId');
    if (!token || !paymentId) { setMessage('Open your orders to check the payment status.'); return; }
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/payments/${paymentId}/status`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(response => response.json()).then(data => {
      if (!data.success) throw new Error(data.message);
      setMessage(data.data.status === 'paid' ? 'Payment confirmed.' :
        data.data.status === 'failed' ? 'Payment failed. Please check your order.' :
          'Payment is pending confirmation. Check your order again shortly.');
    }).catch(() => setMessage('Could not confirm payment yet. Check your order history.'));
  }, []);

  return <main className="min-h-screen bg-[#f8f6f3] flex items-center justify-center p-6">
    <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full text-center">
      <h1 className="text-2xl font-bold mb-4">Payment status</h1>
      <p role="status" className="text-slate-600 mb-6">{message}</p>
      <Link href="/orders" className="text-[#806794] font-semibold">View my orders →</Link>
    </div>
  </main>;
}
