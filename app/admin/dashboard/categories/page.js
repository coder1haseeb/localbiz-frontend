'use client';
import SidebarMenuButton from '../../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', icon: '' });
  const [newArea, setNewArea] = useState('');
  const [editingCat, setEditingCat] = useState(null);

  const base = `/api/v1/categories`;

  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const [catRes, areaRes] = await Promise.all([
        fetch(`${base}`),
        fetch(`${base}/admin/categories/service-areas`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const catData = await catRes.json();
      const areaData = await areaRes.json();
      if (catData.success) setCategories(catData.data.categories || []);
      if (areaData.success) setAreas(areaData.data.areas || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  }, [router, base]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('authToken')}` });

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${base}/admin/categories`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(newCat) });
      const data = await res.json();
      if (data.success) { setNewCat({ name: '', icon: '' }); fetchAll(); }
      else alert(data.message || 'Failed to create category');
    } finally { setBusy(false); }
  };

  const updateCategory = async (cat, updates) => {
    setBusy(true);
    try {
      const res = await fetch(`${base}/admin/categories/${cat._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(updates) });
      const data = await res.json();
      if (data.success) { setEditingCat(null); fetchAll(); }
      else alert(data.message || 'Failed to update category');
    } finally { setBusy(false); }
  };

  const deleteCategory = async (catId) => {
    if (!confirm('Delete this category?')) return;
    setBusy(true);
    try {
      const res = await fetch(`${base}/admin/categories/${catId}`, { method: 'DELETE', headers: authHeaders() });
      const data = await res.json();
      if (data.success) fetchAll();
      else alert(data.message || 'Failed to delete category');
    } finally { setBusy(false); }
  };

  const createArea = async (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${base}/admin/categories/service-areas`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ city: newArea }) });
      const data = await res.json();
      if (data.success) { setNewArea(''); fetchAll(); }
      else alert(data.message || 'Failed to add service area');
    } finally { setBusy(false); }
  };

  const toggleArea = async (area) => {
    setBusy(true);
    try {
      const res = await fetch(`${base}/admin/categories/service-areas/${area._id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ isActive: !area.isActive }) });
      const data = await res.json();
      if (data.success) fetchAll();
    } finally { setBusy(false); }
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <>
      <style>{`.glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); } .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }`}</style>

      <div className="flex min-h-screen bg-[#f7f5ef]">
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 font-['Inter'] z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
            </div>
            <div><h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Super Admin</p></div>
          </div>
          <nav className="flex-1 space-y-1 mt-2 text-sm">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">domain_verification</span><span>Store Approvals</span></Link>
            <Link href="/admin/dashboard/users" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">group</span><span>Users</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-red-600 shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined">category</span><span>Categories</span></div>
            <Link href="/admin/dashboard/reports" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">insights</span><span>Reports</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#253027] mb-2">Categories &amp; Service Areas</h1>
          <p className="text-slate-500 mb-6">Manage platform-wide product categories and delivery cities</p>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full mx-auto"></div></div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Categories */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-[#253027] mb-4">Categories</h3>
                <form onSubmit={createCategory} className="flex gap-2 mb-4">
                  <input value={newCat.name} onChange={e => setNewCat(c => ({ ...c, name: e.target.value }))} placeholder="Category name" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  <input value={newCat.icon} onChange={e => setNewCat(c => ({ ...c, icon: e.target.value }))} placeholder="Icon (optional)" className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  <button disabled={busy} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50">Add</button>
                </form>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <div key={cat._id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      {editingCat === cat._id ? (
                        <input
                          defaultValue={cat.name}
                          autoFocus
                          onBlur={(e) => updateCategory(cat, { name: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                          className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm mr-2"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-[#253027]">{cat.icon ? `${cat.icon} ` : ''}{cat.name}</span>
                      )}
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateCategory(cat, { isActive: !cat.isActive })} className={`text-xs font-bold px-2 py-1 rounded-full ${cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{cat.isActive ? 'Active' : 'Inactive'}</button>
                        <button onClick={() => setEditingCat(cat._id)} className="text-xs font-semibold text-[#31543d] hover:underline">Edit</button>
                        <button onClick={() => deleteCategory(cat._id)} className="text-xs font-semibold text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No categories yet.</p>}
                </div>
              </div>

              {/* Service Areas */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-bold text-[#253027] mb-4">Service Areas</h3>
                <form onSubmit={createArea} className="flex gap-2 mb-4">
                  <input value={newArea} onChange={e => setNewArea(e.target.value)} placeholder="City name" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                  <button disabled={busy} className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 disabled:opacity-50">Add</button>
                </form>
                <div className="space-y-2">
                  {areas.map(area => (
                    <div key={area._id} className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="text-sm font-semibold text-[#253027]">{area.city}</span>
                      <button onClick={() => toggleArea(area)} className={`text-xs font-bold px-2 py-1 rounded-full ${area.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{area.isActive ? 'Active' : 'Inactive'}</button>
                    </div>
                  ))}
                  {areas.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No service areas yet.</p>}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
