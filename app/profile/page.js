'use client';
import SidebarMenuButton from '../../components/SidebarMenuButton.js';
import { clearSession } from '../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({ fullName: '', phone: '', city: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [addrForm, setAddrForm] = useState({ label: '', street: '', city: '', isDefault: false });
  const [editingAddrId, setEditingAddrId] = useState(null);
  const [showAddrForm, setShowAddrForm] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const authFetch = (path, opts = {}) => fetch(`/api/v1${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  });

  const fetchAll = useCallback(async () => {
    const t = localStorage.getItem('authToken');
    if (!t) { router.push('/login'); return; }
    try {
      const [profRes, insRes] = await Promise.all([
        fetch(`/api/v1/customer/profile`, { headers: { Authorization: `Bearer ${t}` } }),
        fetch(`/api/v1/customer/insights`, { headers: { Authorization: `Bearer ${t}` } }),
      ]);
      const profData = await profRes.json();
      const insData = await insRes.json();
      if (profData.success) {
        setProfile(profData.data);
        setForm({ fullName: profData.data.fullName || '', phone: profData.data.phone || '', city: profData.data.city || '' });
      }
      if (insData.success) setInsights(insData.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000); };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/customer/profile', { method: 'PUT', body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) { setProfile(data.data); showMsg('Profile updated.'); }
      else alert(data.message || 'Failed to update profile');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/customer/change-password', { method: 'PUT', body: JSON.stringify(pwForm) });
      const data = await res.json();
      if (data.success) { showMsg('Password changed.'); setPwForm({ currentPassword: '', newPassword: '' }); }
      else alert(data.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingAddrId ? `/customer/addresses/${editingAddrId}` : '/customer/addresses';
      const res = await authFetch(url, { method: editingAddrId ? 'PUT' : 'POST', body: JSON.stringify(addrForm) });
      const data = await res.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, addresses: data.data }));
        setShowAddrForm(false);
        setEditingAddrId(null);
        setAddrForm({ label: '', street: '', city: '', isDefault: false });
        showMsg('Address saved.');
      } else alert(data.message || 'Failed to save address');
    } finally { setSaving(false); }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Delete this address?')) return;
    try {
      const res = await authFetch(`/customer/addresses/${addressId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) setProfile(prev => ({ ...prev, addresses: data.data }));
    } catch (err) { console.error(err); }
  };

  const startEditAddress = (addr) => {
    setEditingAddrId(addr._id);
    setAddrForm({ label: addr.label, street: addr.street, city: addr.city, isDefault: addr.isDefault });
    setShowAddrForm(true);
  };

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#f7f5ef]"><div className="w-8 h-8 border-4 border-[#31543d] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <>
      <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; } .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); } .p-input { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 0.75rem; background: #f8fafc; font-size: 0.875rem; outline: none; } .p-input:focus { border-color: #31543d; background: #fff; }`}</style>

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
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">receipt_long</span><span>My Orders</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span><span>Profile</span></div>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8 max-w-3xl">
          <h1 className="text-4xl font-bold text-[#253027] mb-2">My Profile</h1>
          <p className="text-slate-500 mb-6">Manage your account, addresses and security</p>

          {msg && <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold text-sm">{msg}</div>}

          {insights && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-[#253027]">{insights.totalOrders}</p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-[#253027]">Rs. {insights.totalSpending?.toLocaleString()}</p>
              </div>
              <div className="glass-card rounded-2xl p-5">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">This Month</p>
                <p className="text-2xl font-bold text-[#253027]">Rs. {insights.thisMonth?.spending?.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 mb-6 border-b border-slate-200">
            {['profile', 'addresses', 'security'].map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${tab === t ? 'border-[#31543d] text-[#31543d]' : 'border-transparent text-slate-500'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="glass-card rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                <input className="p-input" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email</label>
                <input className="p-input opacity-60" value={profile?.email || ''} disabled />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone</label>
                <input className="p-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">City</label>
                <input className="p-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <button disabled={saving} className="px-6 py-2.5 bg-[#31543d] text-white font-semibold rounded-xl disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
            </form>
          )}

          {tab === 'addresses' && (
            <div className="space-y-4">
              {profile?.addresses?.map(addr => (
                <div key={addr._id} className="glass-card rounded-2xl p-5 flex items-start justify-between">
                  <div>
                    <p className="font-bold text-[#253027] text-sm">{addr.label}{addr.isDefault && <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Default</span>}</p>
                    <p className="text-sm text-slate-500 mt-1">{addr.street}, {addr.city}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEditAddress(addr)} className="text-xs font-semibold text-[#31543d] hover:underline">Edit</button>
                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-xs font-semibold text-red-500 hover:underline">Delete</button>
                  </div>
                </div>
              ))}

              {!showAddrForm ? (
                <button onClick={() => { setShowAddrForm(true); setEditingAddrId(null); setAddrForm({ label: '', street: '', city: '', isDefault: false }); }} className="px-5 py-2.5 bg-[#31543d]/10 text-[#31543d] font-semibold rounded-xl text-sm">+ Add Address</button>
              ) : (
                <form onSubmit={handleAddAddress} className="glass-card rounded-2xl p-6 space-y-3">
                  <input required placeholder="Label (e.g. Home)" className="p-input" value={addrForm.label} onChange={e => setAddrForm(f => ({ ...f, label: e.target.value }))} />
                  <input required placeholder="Street" className="p-input" value={addrForm.street} onChange={e => setAddrForm(f => ({ ...f, street: e.target.value }))} />
                  <input required placeholder="City" className="p-input" value={addrForm.city} onChange={e => setAddrForm(f => ({ ...f, city: e.target.value }))} />
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" checked={addrForm.isDefault} onChange={e => setAddrForm(f => ({ ...f, isDefault: e.target.checked }))} />
                    Set as default
                  </label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setShowAddrForm(false); setEditingAddrId(null); }} className="px-5 py-2.5 border border-slate-300 rounded-xl text-sm font-semibold">Cancel</button>
                    <button disabled={saving} className="px-5 py-2.5 bg-[#31543d] text-white font-semibold rounded-xl text-sm disabled:opacity-50">{saving ? 'Saving...' : 'Save Address'}</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {tab === 'security' && (
            <form onSubmit={handleChangePassword} className="glass-card rounded-2xl p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Current Password</label>
                <input type="password" required className="p-input" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">New Password</label>
                <input type="password" required minLength={6} className="p-input" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} />
              </div>
              <button disabled={saving} className="px-6 py-2.5 bg-[#31543d] text-white font-semibold rounded-xl disabled:opacity-50">{saving ? 'Saving...' : 'Change Password'}</button>
            </form>
          )}
        </main>
      </div>
    </>
  );
}
