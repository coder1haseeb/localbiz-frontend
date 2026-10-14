'use client';
import SidebarMenuButton from '../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function InventoryPage() {
  const router = useRouter();
  const [inventory, setInventory] = useState([]);
  const [counts, setCounts] = useState({ total: 0, inStock: 0, lowStock: 0, outOfStock: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [stockInputs, setStockInputs] = useState({});

  const fetchInventory = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setInventory(data.data.inventory || []);
        setCounts(data.data.counts || {});
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);

  const updateStock = async (productId, operation) => {
    const qty = parseInt(stockInputs[productId]);
    if (!qty && qty !== 0) { alert('Enter a quantity'); return; }
    setUpdating(productId);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/inventory/${productId}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ operation, quantity: qty }),
      });
      const data = await res.json();
      if (data.success) {
        setStockInputs(prev => ({ ...prev, [productId]: '' }));
        fetchInventory();
      } else alert(data.message || 'Failed to update stock');
    } catch (err) {
      console.error('Stock update failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const handleExport = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/business/inventory/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { alert('Export failed'); return; }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'inventory.csv';
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

  const statusBadge = (status) => {
    if (status === 'out_of_stock') return 'bg-red-100 text-red-600';
    if (status === 'low_stock') return 'bg-amber-100 text-amber-700';
    return 'bg-emerald-100 text-emerald-700';
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
            <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">shopping_bag</span><span>Orders</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>warehouse</span><span>Inventory</span></div>
            <Link href="/dashboard/returns" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">assignment_return</span><span>Returns</span></Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">bar_chart</span><span>Analytics</span></Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Store Profile</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Public site</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#253027] mb-1">Inventory</h1>
              <p className="text-slate-500">Track stock levels across your catalogue</p>
            </div>
            <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-[#253027] text-sm font-semibold rounded-xl hover:bg-slate-50">
              <span className="material-symbols-outlined text-base">download</span>Export CSV
            </button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total</p><p className="text-2xl font-bold text-[#253027]">{counts.total}</p></div>
            <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">In Stock</p><p className="text-2xl font-bold text-emerald-600">{counts.inStock}</p></div>
            <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Low Stock</p><p className="text-2xl font-bold text-amber-600">{counts.lowStock}</p></div>
            <div className="glass-card rounded-2xl p-5"><p className="text-xs text-slate-500 uppercase font-semibold mb-1">Out of Stock</p><p className="text-2xl font-bold text-red-600">{counts.outOfStock}</p></div>
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-[#31543d] rounded-full mx-auto"></div></div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left p-4">Product</th>
                    <th className="text-left p-4">Stock</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Adjust</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item._id} className="border-t border-slate-100">
                      <td className="p-4 font-semibold text-[#253027]">{item.name}</td>
                      <td className="p-4">{item.stockQty}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusBadge(item.stockStatus)}`}>
                          {item.stockStatus?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            placeholder="Qty"
                            value={stockInputs[item._id] || ''}
                            onChange={e => setStockInputs(prev => ({ ...prev, [item._id]: e.target.value }))}
                            className="w-20 px-2 py-1.5 border border-slate-200 rounded-lg text-xs"
                          />
                          <button disabled={updating === item._id} onClick={() => updateStock(item._id, 'increment')} className="px-2 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 disabled:opacity-50">+ Add</button>
                          <button disabled={updating === item._id} onClick={() => updateStock(item._id, 'decrement')} className="px-2 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 disabled:opacity-50">- Remove</button>
                          <button disabled={updating === item._id} onClick={() => updateStock(item._id, 'set')} className="px-2 py-1.5 bg-[#31543d]/10 text-[#31543d] rounded-lg text-xs font-bold hover:bg-[#31543d]/20 disabled:opacity-50">Set</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {inventory.length === 0 && <p className="p-8 text-center text-slate-400 text-sm">No products in inventory yet.</p>}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
