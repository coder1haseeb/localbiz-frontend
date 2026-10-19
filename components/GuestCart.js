'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SidebarMenuButton from './SidebarMenuButton';
import { readGuestCart, writeGuestCart } from '../lib/guestCart';

export default function GuestCart() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState({});

  useEffect(() => { setItems(readGuestCart()); }, []);
  useEffect(() => {
    let active = true;
    Promise.all(items.map(item => fetch(`/api/v1/products/${item.productId}`)
      .then(response => response.json()).then(data => [item.productId, data.success ? data.data : null])
      .catch(() => [item.productId, null])))
      .then(entries => { if (active) setProducts(Object.fromEntries(entries)); });
    return () => { active = false; };
  }, [items.map(item => item.productId).join(',')]);

  const update = (productId, quantity) => {
    const next = items.map(item => item.productId === productId ? { ...item, quantity } : item)
      .filter(item => item.quantity > 0);
    setItems(next);
    writeGuestCart(next);
  };
  const subtotal = items.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0);
  const canCheckout = items.length > 0 && items.every(item => products[item.productId] && products[item.productId].stockQty >= item.quantity);

  return <div className="flex min-h-screen bg-[#f7f5ef]">
    <aside className="h-screen w-72 fixed left-0 top-0 bg-[#efeee7] flex flex-col p-4 space-y-2 text-[13px] font-medium z-40">
      <SidebarMenuButton />
      <Link href="/" className="flex items-center gap-3 px-3 py-6 mb-4"><span className="w-10 h-10 rounded-xl bg-[#31543d] flex items-center justify-center text-white"><span className="material-symbols-outlined">diamond</span></span><span><strong className="block text-lg text-[#253027] leading-none">LocalBiz</strong><small className="text-slate-500">Marketplace</small></span></Link>
      <nav className="flex-1 space-y-1"><Link href="/browse" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-white rounded-lg"><span className="material-symbols-outlined">storefront</span>Browse</Link><div className="flex items-center gap-3 px-4 py-3 bg-white text-[#31543d] shadow-sm rounded-lg font-semibold"><span className="material-symbols-outlined">shopping_cart</span>My Cart{items.length > 0 && <span className="ml-auto bg-[#31543d] text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>}</div></nav>
      <div className="p-4 bg-white/60 rounded-2xl border border-white/40"><p className="text-xs text-slate-400 uppercase font-semibold mb-1">Welcome</p><p className="text-sm font-bold text-[#253027]">Guest shopper</p><p className="text-xs text-slate-500 mt-2">Your cart is saved on this device until you sign in.</p></div>
      <Link href="/login" className="flex items-center gap-3 w-full py-3 px-4 text-[#31543d] font-bold text-sm hover:bg-white rounded-lg"><span className="material-symbols-outlined">login</span>Log in</Link>
    </aside>

    <main className="ml-72 flex-1 p-8 space-y-8"><header className="mb-6"><h1 className="text-4xl font-bold text-[#253027]">My Cart</h1><p className="text-slate-500 text-sm mt-1">Review your selections from local stores.</p></header>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"><div className="lg:col-span-8 space-y-4">
        {items.length === 0 ? <div className="bg-white p-12 rounded-2xl text-center"><span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">shopping_cart</span><h2 className="font-bold text-xl mb-2">Your basket is empty</h2><p className="text-slate-500 mb-6">Browse products and add them to your cart.</p><Link href="/browse" className="px-6 py-3 bg-[#31543d] text-white font-bold rounded-xl inline-block">Browse Products</Link></div>
          : items.map(item => {
            const product = products[item.productId];
            const stock = Number(product?.stockQty || 0);
            return <div key={item.productId} className="bg-white p-5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 shadow-sm">
              <Link href={`/product/${item.productId}`} className="w-24 h-24 rounded-xl overflow-hidden bg-[#e8e9df] shrink-0 flex items-center justify-center">{product?.images?.[0] ? <img alt={product.name} className="w-full h-full object-cover" src={product.images[0]} /> : <span className="material-symbols-outlined text-3xl text-slate-400">inventory_2</span>}</Link>
              <div className="flex-1 w-full"><div className="flex justify-between items-start mb-1"><Link href={`/product/${item.productId}`} className="font-bold text-lg text-[#253027]">{product?.name || 'Product unavailable'}</Link><button type="button" onClick={() => update(item.productId, 0)} className="material-symbols-outlined text-slate-400 hover:text-red-500" aria-label={`Remove ${product?.name || 'product'}`}>delete</button></div>
                <p className="text-sm text-slate-500 mb-4">{product?.business?.storeName || (product ? '' : 'This item is no longer available.')}</p>
                <div className="flex flex-wrap justify-between items-end gap-4"><div className="text-sm text-slate-500">Unit: <strong className="text-lg text-[#31543d]">Rs. {Number(product?.price || 0).toLocaleString()}</strong></div><div className="flex items-center bg-[#e8e9df] rounded-xl p-1"><button type="button" onClick={() => update(item.productId, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 disabled:opacity-40" aria-label="Decrease quantity">−</button><span className="px-4 font-bold">{item.quantity}</span><button type="button" onClick={() => update(item.productId, item.quantity + 1)} disabled={item.quantity >= Math.min(stock, 999)} className="w-8 h-8 disabled:opacity-40" aria-label="Increase quantity">+</button></div><div className="text-right"><span className="block text-[10px] uppercase text-slate-400 font-bold">Total</span><strong className="text-xl text-[#a96b4e]">Rs. {((product?.price || 0) * item.quantity).toLocaleString()}</strong></div></div>
                {product && stock < item.quantity && <p className="text-sm text-red-600 mt-3">Only {stock} in stock. Reduce the quantity to check out.</p>}
              </div>
            </div>;
          })}
      </div><div className="lg:col-span-4 sticky top-8"><div className="bg-white p-8 rounded-3xl border border-white/50 shadow-md"><h2 className="font-bold text-2xl mb-8">Order Summary</h2><div className="flex justify-between text-slate-500 mb-4"><span>Subtotal</span><strong className="text-[#253027]">Rs. {subtotal.toLocaleString()}</strong></div><p className="text-xs text-slate-500 pb-4">No delivery or tax charge is added by the current checkout.</p><div className="pt-6 border-t border-[#d8ddd2] flex justify-between items-end mb-8"><span className="font-bold">Grand Total</span><strong className="text-3xl text-[#31543d]">Rs. {subtotal.toLocaleString()}</strong></div><Link href={canCheckout ? '/checkout' : '#'} aria-disabled={!canCheckout} className={`w-full py-4 bg-[#31543d] text-white font-bold rounded-2xl flex items-center justify-center gap-2 ${canCheckout ? '' : 'pointer-events-none opacity-50'}`}>Proceed to Checkout <span className="material-symbols-outlined">arrow_forward</span></Link><p className="text-xs text-slate-500 mt-4">Sign in to complete your order. Your cart will be added to your account.</p></div></div></div>
    </main>
  </div>;
}
