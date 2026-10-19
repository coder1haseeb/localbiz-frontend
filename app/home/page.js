'use client';
import { clearSession } from '../../lib/session.js';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomerDashboard() {
  const router = useRouter();
  const [stores, setStores] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userName, setUserName] = useState('there');
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, cartCount: 0 });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.fullName) setUserName(user.fullName.split(' ')[0]);
    } catch { /* Keep the welcome fallback if local data is malformed. */ }

    // Fetch verified stores
    const apiUrl = `/api/v1/stores?limit=50`;
    fetch(apiUrl)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.stores) {
          setStores(data.data.stores);
        } else if (data.data?.stores) {
          setStores(data.data.stores);
        } else {
          console.warn('Unexpected response structure:', data);
        }
      })
      .catch(err => console.error('Failed to fetch stores:', err));

    fetch(`/api/v1/recommendations?limit=4`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(data => {
      if (data.success) setRecommendations(data.data.products || []);
    }).catch(err => console.error('Failed to fetch recommendations:', err));

    fetch(`/api/v1/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.items) {
          setStats(prev => ({ ...prev, cartCount: data.data.items.length }));
        }
      })
      .catch(err => console.error('Failed to fetch cart:', err));
  }, []);

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };

  return (
    <>
      <div className="marketplace-shell flex min-h-screen bg-[#f7f5ef]">
        {/* Sidebar Navigation */}
        <aside className={`marketplace-sidebar h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 font-[var(--font-body-face)] text-[13px] font-medium z-40 ${menuOpen ? 'menu-open' : ''}`}>
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#31543d] to-[#a96b4e] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#253027] leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Marketplace</p>
            </div>
          </div>

          <button type="button" className="marketplace-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>

          <nav className="flex-1 space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              <span>Browse</span>
            </div>
            <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer relative">
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>My Cart</span>
              {stats.cartCount > 0 && (
                <span className="ml-auto bg-[#31543d] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {stats.cartCount}
                </span>
              )}
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">receipt_long</span>
              <span>My Orders</span>
            </Link>
            <Link href="/notifications" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
              <span>Notifications</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">account_circle</span>
              <span>Profile</span>
            </Link>
          </nav>

          {/* User Info Card */}
          <div className="p-4 bg-white/60 rounded-2xl border border-white/40">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Welcome</p>
            <p className="text-sm font-bold text-[#253027]">{userName || 'Customer'}</p>
            <p className="text-xs text-slate-500 mt-2">Browse shops and products near you.</p>
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
        <main className="marketplace-main ml-72 flex-1 p-8 space-y-8">
          {/* Welcome Section */}
          <section className="space-y-2">
            <p className="marketplace-eyebrow">LOCAL SHOPS</p>
            <h1 className="text-4xl font-bold text-[#253027]">Hi, {userName}</h1>
            <p className="text-slate-500">Browse stores and products from local businesses.</p>
            <form role="search" className="flex gap-2 max-w-xl pt-3" onSubmit={event => { event.preventDefault(); const term = search.trim(); if (term) sessionStorage.setItem('localbiz:pendingSearch', term); router.push('/browse'); }}>
              <input aria-label="Search products and stores" placeholder="Search products or stores" value={search} onChange={event => setSearch(event.target.value)} className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-4 py-3" />
              <button type="submit" className="rounded-lg bg-[#31543d] px-5 py-3 text-white font-semibold">Search</button>
            </form>
          </section>

          {/* Quick Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-[#31543d]/10 flex items-center justify-center text-[#31543d]">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Live</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Local stores</p>
              <h3 className="text-3xl font-bold text-[#253027]">{stores.length}</h3>
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
              <h3 className="text-3xl font-bold text-[#253027]">{stats.cartCount}</h3>
              <Link href="/cart" className="text-xs text-[#31543d] font-semibold mt-2 inline-block hover:underline">View Cart →</Link>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                </div>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">History</span>
              </div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Your Orders</p>
              <Link href="/orders" className="text-xs text-[#31543d] font-semibold mt-2 inline-block hover:underline">View order history →</Link>
              <p className="text-xs text-slate-400 mt-2">Track your purchases</p>
            </div>
          </section>

          {recommendations.length > 0 && <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#253027] mb-4">Recommended for you</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl">
              {recommendations.map(product => <Link key={product._id} href={`/product/${product._id}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#31543d] transition-colors">
                {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-28 object-cover" /> : <div className="w-full h-28 bg-slate-100 flex items-center justify-center"><span className="material-symbols-outlined text-slate-400">inventory_2</span></div>}
                <div className="p-3"><h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3><p className="text-xs text-slate-500">{product.business?.storeName}</p><p className="text-sm text-[#31543d] mt-1">Rs. {product.price?.toLocaleString()}</p></div>
              </Link>)}
            </div>
          </section>}

          {/* Stores Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#253027] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#31543d]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                  Local stores
                </h2>
                <p className="text-sm text-slate-500 mt-1">Browse local stores and see what they offer.</p>
              </div>
              <Link href="/cart" className="flex items-center gap-2 px-4 py-2 bg-[#31543d] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                <span className="material-symbols-outlined text-base">shopping_cart</span>
                Cart ({stats.cartCount})
              </Link>
            </div>

            {stores.length === 0 ? (
              <div className="glass-card rounded-2xl p-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-3xl text-slate-400">store</span>
                </div>
                <p className="text-[#253027] font-bold text-lg">No verified stores available yet</p>
                <p className="text-slate-500 text-sm mt-1">Please check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stores.map(store => (
                  <Link key={store._id} href={`/store/${store._id}`} className="glass-card rounded-2xl overflow-hidden hover:border-[#9caf9f] transition-colors group">
                    <div className="h-40 w-full bg-[#e0e8dc] relative overflow-hidden flex items-center justify-center border-b border-slate-200">
                      {store.coverImage || store.logo
                        ? <img src={store.coverImage || store.logo} alt="" className="absolute inset-0 w-full h-full object-cover" />
                        : <span className="material-symbols-outlined text-4xl text-[#31543d]" aria-hidden="true">store</span>}                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-600 bg-emerald-100">
                        Verified
                      </div>
                      {store.rating && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#253027]">
                          ⭐ {store.rating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h6 className="font-bold text-[#253027] truncate text-sm">{store.storeName}</h6>
                        <p className="text-xs text-slate-500 truncate">{store.city || 'Local'}</p>
                      </div>
                      {store.description && (
                        <p className="text-xs text-slate-500 line-clamp-2">{store.description}</p>
                      )}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                        <span className="text-[#31543d] font-bold text-xs">
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
