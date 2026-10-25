'use client';
import SidebarMenuButton from '../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StoreLocationPicker from '../../../components/StoreLocationPicker';

export default function BusinessProfilePage() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [imageError, setImageError] = useState('');
  const [form, setForm] = useState({ storeName: '', description: '', address: '', city: '', phone: '', logo: '', coverImage: '', operatingHours: {}, location: null, bankDetails: { bankName: '', accountName: '', accountNumber: '', iban: '' } });

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`/api/v1/business/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.data);
        setForm({
          storeName: data.data.storeName || '',
          description: data.data.description || '',
          address: data.data.address || '',
          city: data.data.city || '',
          location: data.data.location?.coordinates ? { latitude: data.data.location.coordinates[1], longitude: data.data.location.coordinates[0] } : null,
          phone: data.data.phone || '',
          logo: data.data.logo || '',
          coverImage: data.data.coverImage || '',
          operatingHours: data.data.operatingHours || {},
          bankDetails: { bankName: data.data.bankDetails?.bankName || '', accountName: data.data.bankDetails?.accountName || '', accountNumber: data.data.bankDetails?.accountNumber || '', iban: data.data.bankDetails?.iban || '' },
        });
      }
    } catch (err) {
      console.error('Failed to fetch business profile:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const selectImage = (field, file) => {
    setImageError('');
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Choose an image smaller than 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm(current => ({ ...current, [field]: String(reader.result) }));
    reader.onerror = () => setImageError('Could not read the selected image.');
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/v1/business/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, location: form.location || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setBusiness(data.data);
        const businessSummary = { ...data.data };
        delete businessSummary.logo;
        delete businessSummary.coverImage;
        localStorage.setItem('userBusiness', JSON.stringify(businessSummary));
        setMsg('Store profile updated.');
        setTimeout(() => setMsg(''), 3000);
      } else setMsg(data.message || 'Failed to update profile.');
    } catch (err) {
      console.error('Update failed:', err);
      setMsg('Could not save the store profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
            <div><h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1><p className="text-[11px] text-slate-500 font-normal">Business Admin</p></div>
          </div>
          <nav className="flex-1 space-y-1">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">inventory_2</span><span>Products</span></Link>
            <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">shopping_bag</span><span>Orders</span></Link>
            <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">warehouse</span><span>Inventory</span></Link>
            <Link href="/dashboard/returns" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">assignment_return</span><span>Returns</span></Link>
            <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">bar_chart</span><span>Analytics</span></Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span><span>Store Profile</span></div>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
            <Link href="/" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg"><span className="material-symbols-outlined">storefront</span><span>Public site</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-[#253027] mb-2">Store settings</h1>
          <p className="text-slate-500 mb-6">Update your store profile and bank transfer details</p>

          {business?.approvalStatus !== 'approved' && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-semibold ${business?.approvalStatus === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              Store status: {business?.approvalStatus}. {business?.approvalStatus === 'rejected' && business?.rejectionReason}
            </div>
          )}

          {msg && <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold text-sm">{msg}</div>}
          {imageError && <div role="alert" className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{imageError}</div>}

          <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Store Name</label>
              <input className="p-input" value={form.storeName} onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Description</label>
              <textarea rows="3" className="p-input resize-none" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">City</label>
                <input className="p-input" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Phone</label>
                <input className="p-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Address</label>
              <input className="p-input" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
            <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Store location</label><StoreLocationPicker value={form.location} onChange={location => setForm(current => ({ ...current, location }))} /></div>
            <div id="bank-details" className="border-t border-slate-200 pt-5">
              <h2 className="font-bold text-[#253027] mb-1">Bank transfer details</h2>
              <p className="text-xs text-slate-500 mb-4">Customers will see these details after placing a bank transfer order.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['bankName', 'Bank name'], ['accountName', 'Account name'], ['accountNumber', 'Account number'], ['iban', 'IBAN']].map(([field, label]) => (
                  <label key={field} className="text-xs font-bold text-slate-500 uppercase">{label}
                    <input className="p-input mt-1.5" maxLength={100} value={form.bankDetails[field]} onChange={e => setForm(current => ({ ...current, bankDetails: { ...current.bankDetails, [field]: e.target.value } }))} />
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="store-logo" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Store logo</label>
              <input id="store-logo" type="file" accept="image/jpeg,image/png,image/webp" className="p-input" onChange={e => { selectImage('logo', e.target.files?.[0]); e.target.value = ''; }} />
              {form.logo && <div className="mt-3 flex items-center gap-3"><img src={form.logo} alt="Store logo preview" className="w-20 h-20 object-cover rounded-xl border border-slate-200" /><button type="button" className="text-sm text-red-600" onClick={() => setForm(f => ({ ...f, logo: '' }))}>Remove logo</button></div>}
            </div>
            <div>
              <label htmlFor="store-cover" className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Store front image</label>
              <input id="store-cover" type="file" accept="image/jpeg,image/png,image/webp" className="p-input" onChange={e => { selectImage('coverImage', e.target.files?.[0]); e.target.value = ''; }} />
              <p className="text-xs text-slate-500 mt-1">JPG, PNG, or WebP. Maximum 2 MB.</p>
              {form.coverImage && <div className="mt-3"><img src={form.coverImage} alt="Store front preview" className="w-full max-w-md h-40 object-cover rounded-xl border border-slate-200" /><button type="button" className="block mt-2 text-sm text-red-600" onClick={() => setForm(f => ({ ...f, coverImage: '' }))}>Remove image</button></div>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Opening hours</label>
              <div className="grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day =>
                  <label key={day} className="text-sm">{day}<input className="p-input mt-1" placeholder="9:00 AM - 6:00 PM" value={form.operatingHours?.[day] || ''} onChange={e => setForm(f => ({ ...f, operatingHours: { ...f.operatingHours, [day]: e.target.value } }))} /></label>
                )}
              </div>
            </div>
            <button disabled={saving} className="px-6 py-2.5 bg-[#31543d] text-white font-semibold rounded-xl disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </main>
      </div>
    </>
  );
}
