'use client';
import SidebarMenuButton from '../../components/SidebarMenuButton.js';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  ready: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
};

const STATUS_TABS = ['all', 'pending', 'confirmed', 'processing', 'ready', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = useCallback(async (status) => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    try {
      const qs = status && status !== 'all' ? `?status=${status}` : '';
      const res = await fetch(`/api/v1/orders${qs}`, {
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
            <div>
              <h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Marketplace</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Browse</span></Link>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">shopping_cart</span><span>My Cart</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span><span>My Orders</span></div>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">account_circle</span><span>Profile</span></Link>
          </nav>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-4xl font-bold text-[#253027] mb-2">My Orders</h1>
          <p className="text-slate-500 mb-6">Track and manage your order history · <Link href="/returns" className="text-[#31543d] underline">View returns</Link></p>

          <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#31543d] text-white' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-[#31543d] rounded-full mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">receipt_long</span>
              <p className="text-[#253027] font-bold text-lg mb-1">No orders found</p>
              <Link href="/home" className="text-sm text-[#31543d] font-semibold hover:underline">Start shopping →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Link
                  key={order._id}
                  href={`/orders/${order._id}`}
                  className="glass-card rounded-2xl p-6 flex items-center justify-between gap-6 hover:shadow-lg transition-all block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#31543d]/10 flex items-center justify-center text-[#31543d]">
                      <span className="material-symbols-outlined">store</span>
                    </div>
                    <div>
                      <p className="font-bold text-[#253027]">{order.orderId}</p>
                      <p className="text-xs text-slate-500">{order.business?.storeName || 'Store'} · {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-bold text-[#31543d]">Rs. {order.totalAmount?.toLocaleString()}</span>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLES[order.status] || 'bg-slate-100 text-slate-600'}`}>
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                    <span className="material-symbols-outlined text-slate-400">chevron_right</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
