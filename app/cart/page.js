'use client';
import SidebarMenuButton from '../../components/SidebarMenuButton.js';
import { clearSession } from '../../lib/session.js';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // itemId being updated
  const [userName, setUserName] = useState('');

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) { router.push('/login'); return; }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setCart(data.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try { setUserName(JSON.parse(localStorage.getItem('user') || '{}').fullName?.split(' ')[0] || ''); } catch { setUserName(''); }
    fetchCart();
  }, [fetchCart]);

  const handleLogout = () => {
    clearSession();
    router.replace('/login');
  };


  const updateQuantity = async (cartItemId, newQty) => {
    if (newQty < 1) return;
    const token = localStorage.getItem('authToken');
    setUpdating(cartItemId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: newQty }),
      });
      if (res.ok) await fetchCart();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId) => {
    const token = localStorage.getItem('authToken');
    setUpdating(cartItemId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await fetchCart();
    } catch (err) {
      console.error('Remove failed:', err);
    } finally {
      setUpdating(null);
    }
  };

  const subtotal = cart?.items?.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0) || 0;
  // The order API charges product totals only; keep this estimate identical.
  const grandTotal = subtotal;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8f6f3]">
        <div className="w-8 h-8 border-4 border-[#806794] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-summary {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>

      <div className="flex min-h-screen bg-[#f8f6f3]">
        {/* Sidebar Navigation */}
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f1eeeb] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <SidebarMenuButton />
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#806794] to-[#bd8496] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#272a32] leading-none">LocalBiz</h1>
              <p className="text-[11px] text-slate-500 font-normal">Marketplace</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer">
              <span className="material-symbols-outlined">storefront</span>
              <span>Browse</span>
            </Link>
            <div className="flex items-center gap-3 px-4 py-3 bg-white text-[#806794] shadow-sm rounded-lg font-semibold">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
              <span>My Cart</span>
              {cart?.items?.length > 0 && (
                <span className="ml-auto bg-[#806794] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.items.length}
                </span>
              )}
            </div>
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
            <p className="text-sm font-bold text-[#272a32]">{userName || 'Customer'}</p>
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

        {/* Main Content Area */}
        <main className="ml-72 flex-1 p-8 space-y-8">
          <header className="mb-6">
            <h1 className="text-4xl font-bold text-[#272a32]">My Cart</h1>
            <p className="text-slate-500 text-sm mt-1">Review your selections from Pakistani artisans and local creators.</p>
          </header>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Cart Items List (8 Columns) */}
            <div className="lg:col-span-8 space-y-4">
              {!cart?.items || cart.items.length === 0 ? (
                <div className="bg-surface-container-lowest p-12 rounded-2xl text-center shadow-[0_4px_24px_rgba(70,72,212,0.03)]">
                  <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">shopping_cart</span>
                  <h3 className="font-headline font-bold text-xl text-on-surface mb-2">Your basket is empty</h3>
                  <p className="text-on-surface-variant mb-6">Browse products and add them to your cart.</p>
                  <Link href="/home" className="px-6 py-3 bg-gradient-to-br from-[#806794] to-[#bd8496] text-white font-bold rounded-xl inline-block">
                    Browse Products
                  </Link>
                </div>
              ) : (
                cart.items.map(item => (
                  <div key={item._id} className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-[0_4px_24px_rgba(70,72,212,0.03)] group hover:shadow-[0_8px_30px_rgba(70,72,212,0.08)] transition-all">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-surface-container shrink-0">
                      {item.product?.images?.[0] ? (
                        <img alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.product.images[0]} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <span className="material-symbols-outlined text-3xl">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-headline font-bold text-lg text-on-surface">{item.product?.name || 'Product'}</h3>
                        <button
                          onClick={() => removeItem(item._id)}
                          disabled={updating === item._id}
                          className="material-symbols-outlined text-outline hover:text-error transition-colors disabled:opacity-50"
                        >delete</button>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-4">{item.product?.business?.storeName || ''}</p>
                      <div className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-on-surface-variant">Unit:</span>
                          <span className="text-lg font-bold text-primary">Rs. {item.product?.price?.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center bg-surface-container rounded-xl p-1">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={updating === item._id || item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high rounded-lg transition-colors disabled:opacity-40"
                          ><span className="material-symbols-outlined text-lg">remove</span></button>
                          <span className="px-4 font-bold text-on-surface">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            disabled={updating === item._id}
                            className="w-8 h-8 flex items-center justify-center hover:bg-surface-container-high rounded-lg transition-colors disabled:opacity-40"
                          ><span className="material-symbols-outlined text-lg">add</span></button>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] uppercase tracking-wider text-outline font-bold">Total</span>
                          <span className="text-xl font-bold text-secondary">Rs. {((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Right: Order Summary Card (4 Columns) */}
            <div className="lg:col-span-4 sticky top-24">
              <div className="glass-summary p-8 rounded-3xl border border-white/50 shadow-[0_24px_48px_rgba(70,72,212,0.12)]">
                <h2 className="font-headline font-bold text-2xl mb-8">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="text-sm font-medium">Subtotal</span>
                    <span className="font-bold text-on-surface">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant pb-4">No delivery or tax charge is added by the current checkout.</p>
                  <div className="pt-6 border-t border-outline-variant/30 flex justify-between items-end">
                    <div>
                      <span className="block text-[11px] uppercase tracking-widest text-outline font-bold mb-1">Grand Total</span>
                      <span className="text-3xl font-extrabold text-primary">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/checkout"
                  className={`w-full py-4 bg-gradient-to-br from-[#806794] to-[#bd8496] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(70,72,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group mb-6 ${!cart?.items || cart.items.length === 0 ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>

                <div className="bg-surface-container rounded-2xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary mt-0.5">verified_user</span>
                  <p className="text-[11px] leading-relaxed text-on-surface-variant font-medium">
                    Secured by LocalBiz Digital Ledger. All your transactions are protected and support local artisans directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* BottomNavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/95 backdrop-blur-lg dark:bg-slate-950/95 shadow-[0_-8px_30px_rgba(70,72,212,0.1)] rounded-t-3xl border-t-0">
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="/home">
          <span className="material-symbols-outlined mb-1">home</span>
          Home
        </Link>
        <Link className="flex flex-col items-center justify-center bg-[#806794]/10 text-[#806794] rounded-2xl px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="/home">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>search_insights</span>
          Explore
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="/orders">
          <span className="material-symbols-outlined mb-1">task_alt</span>
          Orders
        </Link>
        <Link className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="/profile">
          <span className="material-symbols-outlined mb-1">account_circle</span>
          Profile
        </Link>
      </nav>
    </>
  );
}
