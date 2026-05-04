'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // itemId being updated

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

  useEffect(() => { fetchCart(); }, [fetchCart]);

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
  const delivery = subtotal > 0 ? 450 : 0;
  const tax = Math.round(subtotal * 0.005);
  const grandTotal = subtotal + delivery + tax;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f7f9fb]">
        <div className="w-8 h-8 border-4 border-[#4648d4] border-t-transparent rounded-full animate-spin"></div>
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

      {/* TopNavBar */}
      <header className="bg-[#f7f9fb]/80 backdrop-blur-xl dark:bg-slate-950/80 shadow-[0_4px_24px_rgba(70,72,212,0.07)] sticky top-0 z-50 flex justify-between items-center w-full px-8 py-4">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold bg-gradient-to-br from-[#4648d4] to-[#6b38d4] bg-clip-text text-transparent">LocalBiz</span>
          {/* Search bar */}
          <div className="hidden md:flex items-center bg-surface-container rounded-full px-4 py-2 gap-2 w-64">
            <span className="material-symbols-outlined text-outline text-sm">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full" placeholder="Search marketplace..." type="text" />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-semibold tracking-tight">
          <a className="text-slate-500 hover:text-[#6b38d4] transition-colors duration-200" href="#">Shop</a>
          <a className="text-[#4648d4] font-bold border-b-2 border-[#4648d4]" href="#">Marketplace</a>
          <a className="text-slate-500 hover:text-[#6b38d4] transition-colors duration-200" href="#">Deals</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">notifications</button>
          <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">chat_bubble</button>
          <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">settings</button>
          <div className="h-8 w-8 rounded-full bg-surface-container overflow-hidden">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1wF_ufhXj47VFdxbx9e9T41olQJ_w0F-7NJwQn3IUt6nIHqvfXGl_4BJ_Ha1d2-VfcZSQCP0-bhyjcztsGs4jnHqTSfYZoiFHwD0yF-iRgeIsoB25uTZTR-7JluPsfbjT5mX3xC5wcDFb6QVexxZDkczVzs9TInRgGHA7xFm3-rBhXoHZ0QjL7gZF0Y4bhGB3sQ2jxHtyTNuUU-jsmlnFHBnrNXlYM57WWzb-4GMqod4xPJVIbwBpgrjo-WQp6glWyd0hQrPOO2Y" />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SideNavBar */}
        <aside className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-[#f2f4f6] dark:bg-slate-900 p-4 space-y-2 z-40">
          <div className="flex items-center gap-3 px-2 mb-10 mt-2">
            <div className="w-10 h-10 bg-primary-container rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">token</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#191c1e] dark:text-white leading-tight">LocalBiz</h2>
              <p className="text-[11px] text-slate-500 font-medium">Digital Atelier</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1 font-['Inter'] text-[13px] font-medium">
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] transition-all duration-300 hover:translate-x-1 rounded-lg" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              Overview
            </a>
            {/* Marketplace Active for Cart Context */}
            <a className="flex items-center gap-3 px-4 py-3 bg-white text-[#4648d4] shadow-sm rounded-lg font-semibold transition-all duration-300 translate-x-1" href="#">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              Marketplace
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] transition-all duration-300 hover:translate-x-1 rounded-lg" href="#">
              <span className="material-symbols-outlined">precision_manufacturing</span>
              Operations
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] transition-all duration-300 hover:translate-x-1 rounded-lg" href="#">
              <span className="material-symbols-outlined">insights</span>
              Analytics
            </a>
            <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] transition-all duration-300 hover:translate-x-1 rounded-lg" href="#">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              Administration
            </a>
          </nav>
          <div className="mt-auto pt-4">
            <button className="w-full bg-surface-container-lowest text-primary py-3 rounded-xl font-semibold text-xs border border-outline-variant/20 shadow-sm hover:bg-white transition-all">
              Support Center
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-72 p-6 md:p-12">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface mb-2">My Basket</h1>
            <p className="text-on-surface-variant body-lg">Review your selections from Pakistani artisans and local creators.</p>
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
                  <Link href="/home" className="px-6 py-3 bg-gradient-to-br from-[#4648d4] to-[#6b38d4] text-white font-bold rounded-xl inline-block">
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
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span className="text-sm font-medium">Delivery</span>
                    <span className="font-bold text-on-surface">Rs. {delivery.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant pb-4">
                    <span className="text-sm font-medium">Tax Estimate</span>
                    <span className="font-bold text-on-surface">Rs. {tax.toLocaleString()}</span>
                  </div>
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
                <button className="w-full py-4 bg-gradient-to-br from-[#4648d4] to-[#6b38d4] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(70,72,212,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group mb-6">
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>

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
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="#">
          <span className="material-symbols-outlined mb-1">home</span>
          Home
        </a>
        <a className="flex flex-col items-center justify-center bg-[#4648d4]/10 text-[#4648d4] rounded-2xl px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="#">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>search_insights</span>
          Explore
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="#">
          <span className="material-symbols-outlined mb-1">task_alt</span>
          Tasks
        </a>
        <a className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 px-5 py-2 font-['Inter'] text-[10px] font-semibold uppercase tracking-wider" href="#">
          <span className="material-symbols-outlined mb-1">account_circle</span>
          Profile
        </a>
      </nav>
    </>
  );
}
