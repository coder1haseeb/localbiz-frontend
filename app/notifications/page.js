'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const TYPE_ICONS = {
  order_update: 'local_shipping',
  low_stock: 'inventory_2',
  approval: 'verified_user',
  system: 'info',
  return: 'assignment_return',
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`/api/v1/notifications?limit=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (notifId) => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/v1/notifications/${notifId}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
        setUnreadCount(c => Math.max(0, c - 1));
      }
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const res = await fetch(`/api/v1/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <style>{`.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; } .glass-card { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.3); }`}</style>

      <div className="min-h-screen bg-[#f7f5ef] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#253027]">Notifications</h1>
              <p className="text-slate-500 text-sm mt-1">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="px-4 py-2 bg-[#31543d]/10 text-[#31543d] text-sm font-semibold rounded-xl hover:bg-[#31543d]/20 transition-all">
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-[#31543d] rounded-full mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <span className="material-symbols-outlined text-5xl text-slate-300 block mb-4">notifications_off</span>
              <p className="text-[#253027] font-bold">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map(n => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markRead(n._id)}
                  className={`glass-card rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all ${!n.isRead ? 'border-l-4 border-l-[#31543d]' : 'opacity-70'}`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#31543d]/10 flex items-center justify-center text-[#31543d] shrink-0">
                    <span className="material-symbols-outlined text-lg">{TYPE_ICONS[n.type] || 'notifications'}</span>
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${!n.isRead ? 'font-bold text-[#253027]' : 'font-medium text-slate-600'}`}>{n.title || n.message}</p>
                    {n.title && n.message && <p className="text-xs text-slate-500 mt-1">{n.message}</p>}
                    <p className="text-[11px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && <span className="w-2.5 h-2.5 bg-[#31543d] rounded-full mt-1 shrink-0"></span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
