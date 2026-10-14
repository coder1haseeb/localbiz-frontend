'use client';
import SidebarMenuButton from '../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  ready: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
};

const NEXT_STATUSES = ['confirmed', 'processing', 'ready', 'delivered', 'cancelled'];
const STATUS_TABS = ['all', 'pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled'];

export default function BusinessOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = useCallback(async (status) => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    try {
      const qs = status && status !== 'all' ? `?status=${status}` : '';
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/orders${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchOrders(activeTab); }, [activeTab, fetchOrders]);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) fetchOrders(activeTab);
      else alert(data.message || 'Failed to update status');
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <>
      <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; } .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }`}</style>

      <div className="flex min-h-screen bg-[#f7f5ef]">
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#31543d] to-[#a96b4e] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div><h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Business Admin</p></div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">inventory_2</span><span>Products</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span><span>Orders</span></div>
            <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">warehouse</span><span>Inventory</span></Link>
            <Link href="/dashboard/returns" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">assignment_return</span><span>Returns</span></Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">bar_chart</span><span>Analytics</span></Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Store Profile</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Public site</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#253027] mb-2">Orders</h1>
          <p className="text-slate-500 mb-6">Manage incoming orders for your store</p>

          <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
            {STATUS_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#31543d] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-[#31543d] rounded-full mx-auto"></div></div>
          ) : orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">shopping_bag</span>
              <p className="text-[#253027] font-bold text-lg">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between gap-6 cursor-pointer" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#31543d]/10 flex items-center justify-center text-[#31543d]"><span className="material-symbols-outlined">receipt_long</span></div>
                      <div>
                        <p className="font-bold text-[#253027]">{order.orderId}</p>
                        <p className="text-xs text-slate-500">{order.customer?.fullName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#31543d]">Rs. {order.totalAmount?.toLocaleString()}</span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}>{order.status}</span>
                      <span className="material-symbols-outlined text-slate-400">{expanded === order._id ? 'expand_less' : 'expand_more'}</span>
                    </div>
                  </div>

                  {expanded === order._id && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <p className="text-xs text-slate-500">{order.customer?.email} · {order.customer?.phone}</p>
                      <p className="text-xs text-slate-500">Delivery: {order.deliveryAddress?.street}, {order.deliveryAddress?.city}</p>
                      <p className="text-xs text-slate-500">Payment: {order.paymentMethod?.replace('_', ' ')} · {order.paymentStatus}</p>

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-xs font-semibold text-slate-500">Update status:</span>
                          {NEXT_STATUSES.map(s => (
                            <button
                              key={s}
                              onClick={(e) => { e.stopPropagation(); updateStatus(order._id, s); }}
                              disabled={updating === order._id}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all disabled:opacity-50 ${s === 'cancelled' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-[#31543d]/10 text-[#31543d] hover:bg-[#31543d]/20'}`}
                            >
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
