'use client';
import SidebarMenuButton from '../../../../components/SidebarMenuButton.js';
import { clearSession } from '../../../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(null);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/admin/login'); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.set('role', roleFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      params.set('limit', '50');
      const res = await fetch(`/api/v1/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setUsers(data.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [router, roleFilter, statusFilter, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const doAction = async (userId, action) => {
    if (action === 'delete' && !confirm('Delete this user permanently?')) return;
    setBusy(userId);
    const token = localStorage.getItem('authToken');
    try {
      const method = action === 'delete' ? 'DELETE' : 'PUT';
      const res = await fetch(`/api/v1/admin/users/${userId}${action === 'delete' ? '' : `/${action}`}`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) fetchUsers();
      else alert(data.message || 'Action failed');
    } catch (err) {
      console.error('Action failed:', err);
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
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-red-600 shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined">group</span><span>Users</span></div>
            <Link href="/admin/dashboard/categories" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">category</span><span>Categories</span></Link>
            <Link href="/admin/dashboard/reports" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">insights</span><span>Reports</span></Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] rounded-lg font-semibold"><span className="material-symbols-outlined">notifications</span><span>Notifications</span></Link>
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg"><span className="material-symbols-outlined">logout</span>Logout</button>
        </aside>

        <main className="ml-72 flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#253027] mb-2">User Management</h1>
          <p className="text-slate-500 mb-6">Manage customer and business admin accounts</p>

          <div className="flex gap-3 mb-6 flex-wrap">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm flex-1 min-w-[200px]" />
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="business_admin">Business Admin</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center"><div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full mx-auto"></div></div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-t border-slate-100">
                      <td className="p-4 font-semibold text-[#253027]">{u.fullName}</td>
                      <td className="p-4 text-slate-500">{u.email}</td>
                      <td className="p-4">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{u.role?.replace('_', ' ')}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                          {u.isActive !== false ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {u.isActive !== false ? (
                            <button disabled={busy === u._id} onClick={() => doAction(u._id, 'suspend')} className="px-3 py-1.5 text-xs font-semibold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 disabled:opacity-50">Suspend</button>
                          ) : (
                            <button disabled={busy === u._id} onClick={() => doAction(u._id, 'activate')} className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 disabled:opacity-50">Activate</button>
                          )}
                          <button disabled={busy === u._id} onClick={() => doAction(u._id, 'delete')} className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && <p className="p-8 text-center text-slate-400 text-sm">No users found.</p>}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
