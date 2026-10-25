'use client';
import SidebarMenuButton from '../../../components/SidebarMenuButton.js';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PaymentProofPanel from '../../../components/PaymentProofPanel.js';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  ready: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [payError, setPayError] = useState('');
  const [uploadedProof, setUploadedProof] = useState('');
  const [proofLoadError, setProofLoadError] = useState('');
  const [proofLoading, setProofLoading] = useState(false);
  const [returnModal, setReturnModal] = useState(null); // product being returned
  const [returnReason, setReturnReason] = useState('');
  const [returnDesc, setReturnDesc] = useState('');

  const fetchOrder = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`/api/v1/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.success) setOrder(data.data);
      else router.push('/orders');
    } catch (err) {
      console.error('Failed to fetch order:', err);
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { if (id) fetchOrder(); }, [id, fetchOrder]);

  useEffect(() => {
    if (!order || order.paymentMethod !== 'bank_transfer' || !['submitted', 'accepted', 'rejected'].includes(order.proofStatus)) {
      setUploadedProof('');
      setProofLoading(false);
      return;
    }
    let active = true;
    setProofLoading(true);
    setProofLoadError('');
    fetch(`/api/v1/orders/${id}/payment-proof`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }, cache: 'no-store',
    }).then(res => res.json()).then(data => {
      if (!active) return;
      if (data.success) setUploadedProof(data.data.proofImage || '');
      else setProofLoadError(data.message || 'Could not load payment proof.');
    }).catch(() => { if (active) setProofLoadError('Could not load payment proof.'); })
      .finally(() => { if (active) setProofLoading(false); });
    return () => { active = false; };
  }, [id, order?.proofStatus, order?.paymentMethod]);

  const handlePayNow = async () => {
    setBusy(true);
    setMsg('');
    setPayError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/v1/payments/safepay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: id }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not start payment.');
      if (data.data.status === 'paid') {
        setMsg('Payment already confirmed.');
        await fetchOrder();
        return;
      }
      if (!data.data.paymentId || !data.data.redirectUrl) throw new Error('Safepay did not return a checkout link.');
      sessionStorage.setItem('pendingPaymentId', data.data.paymentId);
      window.location.assign(data.data.redirectUrl);
    } catch (err) {
      setPayError(err.message || 'Could not start payment. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Cancel this order?')) return;
    setBusy(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/v1/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Order cancelled.');
        fetchOrder();
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Cancel failed:', err);
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadInvoice = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/v1/invoices/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert('Failed to download invoice'); return; }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${order.orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Invoice download failed:', err);
      alert('Failed to download invoice');
    }
  };

  const submitReturn = async () => {
    if (!returnReason.trim()) { alert('Please provide a reason.'); return; }
    setBusy(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/v1/returns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          orderId: id,
          productId: returnModal.product?._id || returnModal.product,
          reason: returnReason,
          description: returnDesc,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg('Return request submitted.');
        setReturnModal(null);
        setReturnReason('');
        setReturnDesc('');
      } else {
        alert(data.message || 'Failed to submit return');
      }
    } catch (err) {
      console.error('Return failed:', err);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-[#f7f5ef]"><div className="w-8 h-8 border-4 border-[#31543d] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  if (!order) return null;

  return (
    <>
      <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; } .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }`}</style>

      <div className="flex min-h-screen bg-[#f7f5ef]">
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 font-[var(--font-body-face)] text-[13px] font-medium z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#31543d] to-[#a96b4e] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div><h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Marketplace</p></div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Browse</span></Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">shopping_cart</span><span>My Cart</span></Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span><span>My Orders</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">account_circle</span><span>Profile</span></Link>
          </nav>
        </aside>

        <main className="ml-72 flex-1 p-8 max-w-4xl">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-[#253027]">{order.orderId}</h1>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}>
              Order: {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
            </span>
          </div>
          <p className="text-slate-500 mb-6">Placed on {new Date(order.createdAt).toLocaleString()}</p>

          {msg && <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold text-sm">{msg}</div>}
          {payError && <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-sm">{payError}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Store</h3>
              <p className="font-bold text-[#253027]">{order.business?.storeName}</p>
              <p className="text-sm text-slate-500 mt-1">{order.business?.address}, {order.business?.city}</p>
              <p className="text-sm text-slate-500">{order.business?.phone}</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Delivery Address</h3>
              {order.contact?.fullName && <p className="font-semibold text-[#253027]">{order.contact.fullName}</p>}
              {order.contact?.phone && <p className="text-sm text-slate-500">{order.contact.phone}</p>}
              {order.contact?.email && <p className="text-sm text-slate-500">{order.contact.email}</p>}
              <p className="text-sm text-[#253027]">{order.deliveryAddress?.street}</p>
              <p className="text-sm text-slate-500">{order.deliveryAddress?.city}</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><span className="material-symbols-outlined">inventory_2</span></div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#253027] text-sm">{item.product?.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity} × Rs. {item.price?.toLocaleString?.() ?? item.product?.price?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#31543d] text-sm">Rs. {((item.price ?? item.product?.price ?? 0) * item.quantity).toLocaleString()}</span>
                    {order.status === 'delivered' && (
                      <button
                        onClick={() => setReturnModal(item)}
                        className="text-xs font-semibold text-red-500 hover:underline"
                      >
                        Request Return
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 mb-6 space-y-2">
            <div className="flex justify-between text-sm text-slate-500"><span>Payment Method</span><span className="font-semibold text-[#253027] uppercase">{order.paymentMethod?.replace('_', ' ')}</span></div>
            <div className="flex justify-between text-sm text-slate-500"><span>Payment Status</span><span className={`font-semibold capitalize ${order.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>{order.paymentStatus}</span></div>
            <div className="flex justify-between pt-3 mt-2 border-t border-slate-200">
              <span className="font-bold text-[#253027]">Total</span>
              <span className="text-2xl font-extrabold text-[#31543d]">Rs. {order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {order.paymentMethod === 'bank_transfer' && order.proofStatus !== 'none' && (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h2 className="font-bold text-xl text-[#253027] mb-2">Uploaded payment proof</h2>
              <p className="text-sm text-slate-600 mb-3">Review status: {order.proofStatus}</p>
              {uploadedProof ? <img src={uploadedProof} alt={`Uploaded payment proof for ${order.orderId}`} className="max-h-96 max-w-full rounded-xl border border-slate-200 object-contain" /> : <p className="text-sm text-slate-500">{proofLoading ? 'Loading proof image…' : proofLoadError || 'No proof image is available.'}</p>}
            </div>
          )}

          {order.paymentMethod === 'bank_transfer' && order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
            <div className="glass-card rounded-2xl p-6 mb-6">
              <h2 className="font-bold text-xl text-[#253027] mb-4">Bank transfer payment</h2>
              {order.proofStatus === 'submitted' ? <p className="text-amber-700 font-semibold">Your proof is awaiting store review.</p> : <>
                {order.proofStatus === 'rejected' && <p className="text-red-700 mb-4">The store rejected the previous proof. Please upload a new one.</p>}
                <PaymentProofPanel order={order} onSubmitted={fetchOrder} />
              </>}
            </div>
          )}

          <div className="flex gap-3">
            {order.paymentMethod === 'safepay' && order.paymentStatus === 'pending' && order.status !== 'cancelled' && (
              <button onClick={handlePayNow} disabled={busy} className="flex items-center gap-2 px-6 py-3 bg-[#31543d] text-white font-semibold rounded-xl hover:bg-[#3d694b] disabled:opacity-50">
                <span className="material-symbols-outlined text-base">credit_card</span>
                {busy ? 'Opening payment…' : 'Pay now with Safepay'}
              </button>
            )}
            <button onClick={handleDownloadInvoice} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[#253027] font-semibold rounded-xl hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-base">download</span>
              Download Invoice
            </button>
            {order.status === 'pending' && (
              <button onClick={handleCancel} disabled={busy} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-all disabled:opacity-50">
                <span className="material-symbols-outlined text-base">cancel</span>
                Cancel Order
              </button>
            )}
          </div>
        </main>
      </div>

      {returnModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-[#253027]">Request Return</h3>
            <p className="text-sm text-slate-600">{returnModal.product?.name}</p>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Reason *</label>
              <input value={returnReason} onChange={e => setReturnReason(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#31543d]" placeholder="e.g. Item damaged" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Details</label>
              <textarea value={returnDesc} onChange={e => setReturnDesc(e.target.value)} rows="3" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#31543d] resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setReturnModal(null)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={submitReturn} disabled={busy} className="flex-1 py-2.5 bg-[#31543d] text-white font-semibold rounded-lg hover:bg-[#3a3bb8] disabled:opacity-50">Submit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
