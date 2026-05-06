'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [userName, setUserName] = useState('there');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    cartCount: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.fullName) setUserName(user.fullName.split(' ')[0]);

    // Fetch verified stores
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/stores?limit=50`;
    fetch(apiUrl)
      .then(r => r.json())
      .then(data => {
        console.log('Stores API Response:', data);
        if (data.success && data.data?.stores) {
          setStores(data.data.stores);
        } else if (data.data?.stores) {
          // Handle case where stores exist but success flag might be different
          setStores(data.data.stores);
        } else {
          console.warn('Unexpected response structure:', data);
        }
      })
      .catch(err => console.error('Failed to fetch stores:', err));

    // Fetch cart data for stats
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.items) {
          setStats(prev => ({
            ...prev,
            cartCount: data.data.items.length,
          }));
        }
      })
      .catch(err => console.error('Failed to fetch cart:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="flex min-h-screen bg-[#f7f9fb]">
        {/* Sidebar Navigation */}
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f2f4f6] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1e] leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Marketplace</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#4648d4] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              <span>Browse</span>
            </div>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>My Cart</span>
              {stats.cartCount > 0 && (
                <span className="ml-auto bg-[#4648d4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* User Info Card */}
          <div className="p-4 bg-white/60 rounded-2xl border border-white/40">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Welcome</p>
            <p className="text-sm font-bold text-[#191c1e]">{userName || 'Customer'}</p>
            <p className="text-xs text-slate-500 mt-2">Explore local atelier and artisan shops.</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-3 px-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="ml-72 flex-1 p-8 space-y-8">
          {/* Welcome Section */}
          <section className="space-y-2">
            <h1 className="text-4xl font-bold text-[#191c1e]">Welcome back, {userName}!</h1>
            <p className="text-slate-500">Discover amazing local products from artisans and small businesses</p>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-[#4648d4]/10 flex items-center justify-center text-[#4648d4]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Live</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Verified Stores</p>
              <h3 className="text-3xl font-bold text-[#191c1e]">{stores.length}</h3>
              <p className="text-xs text-slate-400 mt-2">Local businesses available</p>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                </div>
                <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">{stats.cartCount}</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">In Your Cart</p>
              <h3 className="text-3xl font-bold text-[#191c1e]">{stats.cartCount}</h3>
              <Link href="/cart" className="text-xs text-[#4648d4] font-semibold mt-2 inline-block hover:underline">View Cart →</Link>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Saved</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Favourite Items</p>
              <h3 className="text-3xl font-bold text-[#191c1e]">0</h3>
              <p className="text-xs text-slate-400 mt-2">Save products for later</p>
            </div>
          </section>

          {/* Stores Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#191c1e] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                  Verified Stores
                </h2>
                <p className="text-sm text-slate-500 mt-1">Browse {stores.length} verified local stores</p>
              </div>
              <Link href="/cart" className="flex items-center gap-2 px-4 py-2 bg-[#4648d4] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                Cart ({stats.cartCount})
              </Link>
            </div>

            {stores.length === 0 ? (
              <div className="glass-card rounded-2xl p-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-slate-400">store</span>
                </div>
                <p className="text-[#191c1e] font-bold text-lg">No verified stores available yet</p>
                <p className="text-slate-500 text-sm mt-1">Check back soon for amazing local stores!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stores.map(store => (
                  <Link key={store._id} href={`/store/${store._id}`} className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all group">
                    <div className="h-40 w-full bg-gradient-to-br from-[#4648d4]/10 to-[#6b38d4]/10 relative overflow-hidden flex items-center justify-center border-b border-slate-200">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#4648d4]/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                        </div>
                      </div>
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-600 bg-emerald-100">
                        Verified
                      </div>
                      {store.rating && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#191c1e]">
                          ⭐ {store.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h6 className="font-bold text-[#191c1e] truncate text-sm">{store.storeName}</h6>
                        <p className="text-xs text-slate-500 truncate">{store.city || 'Local'}</p>
                      </div>
                      {store.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">{store.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-[#4648d4] font-bold text-xs">
                          {store.category?.name || 'Local Store'}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Active
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </main>
        </div>
      </>
    );
  }
