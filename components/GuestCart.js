'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicHeader from './PublicHeader';
import { readGuestCart, writeGuestCart } from '../lib/guestCart';
import '../app/landing.css';

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
  const total = items.reduce((sum, item) => sum + (products[item.productId]?.price || 0) * item.quantity, 0);

  return <div className="landing-page"><PublicHeader /><main className="catalogue-section guest-cart"><h1>Your cart</h1>
    {items.length ? <><div className="guest-cart-items">{items.map(item => {
      const product = products[item.productId];
      return <div className="guest-cart-row" key={item.productId}>
        <Link href={`/product/${item.productId}`}>{product?.images?.[0] ? <img src={product.images[0]} alt="" /> : <span className="material-symbols-outlined">inventory_2</span>}</Link>
        <div><Link href={`/product/${item.productId}`}><strong>{product?.name || 'Product unavailable'}</strong></Link><p>{product ? `Rs. ${Number(product.price).toLocaleString()}` : 'This item may no longer be available.'}</p></div>
        <label>Qty <input type="number" min="1" max={Math.min(999, product?.stockQty || 999)} value={item.quantity} onChange={event => { const value = Number(event.target.value); if (Number.isInteger(value) && value > 0) update(item.productId, value); }} /></label>
        <button type="button" onClick={() => update(item.productId, 0)} aria-label={`Remove ${product?.name || 'product'}`}>Remove</button>
      </div>;
    })}</div><p className="guest-cart-total">Estimated total: <strong>Rs. {total.toLocaleString()}</strong></p><p>Sign in to save your cart and check out.</p><Link href="/login" className="guest-cart-checkout">Sign in to checkout</Link></>
      : <><p>Your cart is empty.</p><Link href="/browse">Browse products →</Link></>}
  </main></div>;
}
