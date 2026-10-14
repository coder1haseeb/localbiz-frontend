'use client';
import SidebarMenuButton from '../../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminReportsPage() {
  const router = useRouter();
  const [growth, setGrowth] = useState(null);
  const [topStores, setTopStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }
    try {
      const base = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/reports`;
      const headers = { Authorization: `Bearer ${token}` };
      const [growthRes, topRes] = await Promise.all([
        fetch(`${base}/growth`, { headers }),
        fetch(`${base}/top-stores?limit=10`, { headers }),
      ]);
      const growthData = await growthRes.json();
      const topData = await topRes.json();
      if (growthData.success) setGrowth(growthData.data.monthly);
      if (topData.success) setTopStores(topData.data.stores || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExport = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/reports/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert('Export failed'); return; }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'platform-report.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  const maxOrders = Math.max(...(growth?.orders?.map(o => o.revenue) || [0]), 1);

  return (
    <>
      <style>{`.glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); } .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }`}</style>

      <div className="flex min-h-screen bg-[#f8f6f3]">
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f1eeeb] flex flex-col p-4 space-y-2 font-['Inter'] z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <div><h1 className="text-lg font-bold text-[#272a32] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Super Admin</p></div>
          </div>
          <nav className="flex-1 space-y-1 mt-2 text-sm">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">domain_verification</span><span>Store Approvals</span></Link>
            <Link href="/admin/dashboard/users" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">group</span><span>Users</span></Link>
            <Link href="/admin/dashboard/categories" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">category</span><span>Categories</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-red-600 shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined">insights</span><span>Reports</span></div>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#272a32] mb-1">Platform Reports</h1>
              <p className="text-slate-500">Growth trends and top-performing stores</p>
            </div>
            <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#272a32] text-sm font-semibold rounded-xl hover:bg-slate-50">
              <span className="material-symbols-outlined text-base">download</span>Export CSV
            </button>
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full mx-auto"></div></div>
          ) : (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-[#272a32] mb-4">Monthly Order Revenue</h3>
                {!growth?.orders?.length ? <p className="text-sm text-slate-400 py-8 text-center">No data yet</p> : (
                  <div className="flex items-end gap-3 h-40">
                    {growth.orders.map((o, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg" style={{ height: `${Math.max(4, (o.revenue / maxOrders) * 130)}px` }} title={`Rs. ${o.revenue}`}></div>
                        <span className="text-[10px] text-slate-400">{o._id}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-[#272a32] mb-4">New Customers / Month</h3>
                  <div className="space-y-2">
                    {growth?.newCustomers?.map((c, i) => (
                      <div key={i} className="flex justify-between text-sm"><span className="text-slate-500">{c._id}</span><span className="font-bold text-[#272a32]">{c.count}</span></div>
                    ))}
                    {!growth?.newCustomers?.length && <p className="text-sm text-slate-400 text-center py-4">No data yet</p>}
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="font-bold text-[#272a32] mb-4">New Businesses / Month</h3>
                  <div className="space-y-2">
                    {growth?.newBusinesses?.map((b, i) => (
                      <div key={i} className="flex justify-between text-sm"><span className="text-slate-500">{b._id}</span><span className="font-bold text-[#272a32]">{b.count} <span className="text-emerald-600">({b.approved} approved)</span></span></div>
                    ))}
                    {!growth?.newBusinesses?.length && <p className="text-sm text-slate-400 text-center py-4">No data yet</p>}
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-[#272a32] mb-4">Top Stores</h3>
                <div className="space-y-3">
                  {topStores.length === 0 ? <p className="text-sm text-slate-400 text-center py-4">No data yet</p> : topStores.map((s, i) => (
                    <div key={s.businessId} className="flex items-center justify-between p-3 bg-white/60 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <div>
                          <p className="text-sm font-bold text-[#272a32]">{s.storeName}</p>
                          <p className="text-xs text-slate-500">{s.city} · {s.ordersCount} orders</p>
                        </div>
                      </div>
                      <span className="font-bold text-red-600">Rs. {s.totalRevenue?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
