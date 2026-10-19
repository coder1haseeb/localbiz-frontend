'use client';
import SidebarMenuButton from '../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AnalyticsPage() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [sales, setSales] = useState([]);
  const [period, setPeriod] = useState('week');
  const [topProducts, setTopProducts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async (p) => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    setLoading(true);
    try {
      const base = `/api/v1/business/analytics`;
      const headers = { Authorization: `Bearer ${token}` };
      const [sumRes, salesRes, topRes, payRes, custRes] = await Promise.all([
        fetch(`${base}/summary`, { headers }),
        fetch(`${base}/sales?period=${p}`, { headers }),
        fetch(`${base}/top-products?limit=5`, { headers }),
        fetch(`${base}/payments`, { headers }),
        fetch(`${base}/customers`, { headers }),
      ]);
      const [sumData, salesData, topData, payData, custData] = await Promise.all([sumRes.json(), salesRes.json(), topRes.json(), payRes.json(), custRes.json()]);
      if (sumData.success) setSummary(sumData.data);
      if (salesData.success) setSales(salesData.data.data || []);
      if (topData.success) setTopProducts(topData.data.products || []);
      if (payData.success) setPayments(payData.data.breakdown || []);
      if (custData.success) setCustomers(custData.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(period); }, [period, fetchAll]);

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  const maxRevenue = Math.max(...sales.map(s => s.totalRevenue || 0), 1);

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
            <div><h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Business Admin</p></div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">inventory_2</span><span>Products</span></Link>
            <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">shopping_bag</span><span>Orders</span></Link>
            <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">warehouse</span><span>Inventory</span></Link>
            <Link href="/dashboard/returns" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">assignment_return</span><span>Returns</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span><span>Analytics</span></div>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Store Profile</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Public site</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#253027] mb-2">Analytics</h1>
          <p className="text-slate-500 mb-6">Sales performance and customer insights</p>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-[#31543d] rounded-full mx-auto"></div></div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Revenue</p><p className="text-xl font-bold text-[#253027]">Rs. {summary?.totalRevenue?.toLocaleString() || 0}</p></div>
                <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Today's Revenue</p><p className="text-xl font-bold text-[#253027]">Rs. {summary?.todayRevenue?.toLocaleString() || 0}</p></div>
                <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Today's Orders</p><p className="text-xl font-bold text-[#253027]">{summary?.todayOrdersCount || 0}</p></div>
                <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Pending Orders</p><p className="text-xl font-bold text-amber-600">{summary?.pendingOrdersCount || 0}</p></div>
                <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Low Stock Alerts</p><p className="text-xl font-bold text-red-600">{summary?.lowStockAlertsCount || 0}</p></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Sales Trend */}
                <div className="glass-card rounded-2xl p-6 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[#253027]">Sales Trend</h3>
                    <div className="flex gap-1">
                      {['day', 'week', 'month'].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 text-xs font-semibold rounded-lg ${period === p ? 'bg-[#31543d] text-white' : 'bg-slate-100 text-slate-600'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  {sales.length === 0 ? (
                    <p className="text-sm text-slate-400 py-8 text-center">No sales data yet</p>
                  ) : (
                    <div className="flex items-end gap-2 h-48">
                      {sales.map((s, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-gradient-to-t from-[#31543d] to-[#a96b4e] rounded-t-lg" style={{ height: `${Math.max(4, (s.totalRevenue / maxRevenue) * 160)}px` }} title={`Rs. ${s.totalRevenue}`}></div>
                          <span className="text-[10px] text-slate-400 truncate w-full text-center">{s._id?.slice(5)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Breakdown */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-[#253027] mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    {payments.length === 0 ? <p className="text-sm text-slate-400">No payment data</p> : payments.map((p, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 capitalize">{p._id?.replace('_', ' ')}</span>
                        <span className="font-bold text-[#253027]">Rs. {p.totalAmount?.toLocaleString()} ({p.ordersCount})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-[#253027] mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {topProducts.length === 0 ? <p className="text-sm text-slate-400">No sales yet</p> : topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#31543d]/10 text-[#31543d] text-xs font-bold flex items-center justify-center">{i + 1}</span>
                          <span className="text-sm font-semibold text-[#253027]">{p.productName}</span>
                        </div>
                        <span className="text-sm font-bold text-[#31543d]">Rs. {p.totalRevenue?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Insights */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-[#253027] mb-4">Customer Insights</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total</p><p className="text-xl font-bold text-[#253027]">{customers?.totalCustomers || 0}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase font-semibold mb-1">New</p><p className="text-xl font-bold text-emerald-600">{customers?.newCustomers || 0}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Returning</p><p className="text-xl font-bold text-[#31543d]">{customers?.returningCustomers || 0}</p></div>
                    <div><p className="text-xs text-slate-500 uppercase font-semibold mb-1">One-time</p><p className="text-xl font-bold text-slate-500">{customers?.oneTimeCustomers || 0}</p></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
