'use client';
import SidebarMenuButton from '../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function BusinessReturnsPage() {
  const router = useRouter();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [busy, setBusy] = useState(null);
  const [noteModal, setNoteModal] = useState(null);
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState('approved');

  const fetchReturns = useCallback(async (status) => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    try {
      const qs = status && status !== 'all' ? `?status=${status}` : '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/returns${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setReturns(data.data.returns || []);
    } catch (err) {
      console.error('Failed to fetch returns:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchReturns(activeTab); }, [activeTab, fetchReturns]);

  const openDecision = (ret, dec) => {
    setNoteModal(ret);
    setDecision(dec);
    setNote('');
  };

  const submitDecision = async () => {
    setBusy(noteModal._id);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/returns/${noteModal._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: decision, adminNote: note }),
      });
      const data = await res.json();
      if (data.success) {
        setNoteModal(null);
        fetchReturns(activeTab);
      } else alert(data.message || 'Failed to update return');
    } catch (err) {
      console.error('Return decision failed:', err);
    } finally {
      setBusy(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <>
      <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; } .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }`}</style>

      <div className="flex min-h-screen bg-[#f8f6f3]">
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f1eeeb] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#806794] to-[#bd8496] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div><h1 className="text-lg font-bold text-[#272a32] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Business Admin</p></div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">inventory_2</span><span>Products</span></Link>
            <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">shopping_bag</span><span>Orders</span></Link>
            <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">warehouse</span><span>Inventory</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#806794] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_return</span><span>Returns</span></div>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">bar_chart</span><span>Analytics</span></Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Store Profile</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Public site</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#272a32] mb-2">Return Requests</h1>
          <p className="text-slate-500 mb-6">Review and process customer return requests</p>

          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'approved', 'rejected'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-[#806794] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-[#806794] rounded-full mx-auto"></div></div>
          ) : returns.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">assignment_return</span>
              <p className="text-[#272a32] font-bold text-lg">No return requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returns.map(ret => (
                <div key={ret._id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-bold text-[#272a32]">{ret.returnId} <span className="text-slate-400 font-normal">· Order {ret.order?.orderId}</span></p>
                      <p className="text-sm text-slate-600 mt-1">{ret.orderItem?.productName} × {ret.orderItem?.quantity}</p>
                      <p className="text-sm text-slate-500 mt-2"><span className="font-semibold">Reason:</span> {ret.reason}</p>
                      {ret.description && <p className="text-sm text-slate-500 mt-1">{ret.description}</p>}
                      <p className="text-xs text-slate-400 mt-2">{ret.customer?.fullName} · {ret.customer?.email}</p>
                      {ret.adminNote && <p className="text-xs text-slate-500 mt-2 italic">Note: {ret.adminNote}</p>}
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${STATUS_STYLES[ret.status]}`}>{ret.status}</span>
                  </div>
                  {ret.status === 'pending' && (
                    <div className="flex gap-3 pt-4 mt-4 border-t border-slate-100">
                      <button onClick={() => openDecision(ret, 'approved')} className="flex-1 py-2 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 text-sm">Approve</button>
                      <button onClick={() => openDecision(ret, 'rejected')} className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 text-sm">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {noteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-[#272a32]">{decision === 'approved' ? 'Approve' : 'Reject'} Return</h3>
            <p className="text-sm text-slate-600">{noteModal.returnId}</p>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows="3" placeholder="Optional note for customer" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg outline-none focus:border-[#806794] resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setNoteModal(null)} className="flex-1 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50">Cancel</button>
              <button onClick={submitDecision} disabled={busy === noteModal._id} className={`flex-1 py-2.5 text-white font-semibold rounded-lg disabled:opacity-50 ${decision === 'approved' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'}`}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
