'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addGuestItem } from '../lib/guestCart';
import { getSession } from '../lib/session';

export default function PublicCatalogue({ full = false }) {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('search')?.trim() || '';
    if (initial) { setQuery(initial); setSearch(initial); }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const pageSize = full ? 24 : 8;
    const params = new URLSearchParams({ limit: String(pageSize), page: String(page) });
    if (search) params.set('search', search);
    Promise.all([
      fetch(`/api/v1/products/public?${params}`).then(response => response.json()),
      fetch(`/api/v1/stores?${params}`).then(response => response.json()),
    ]).then(([productData, storeData]) => {
      if (!active) return;
      const nextProducts = productData.success ? productData.data?.products || [] : [];
      const nextStores = storeData.success ? storeData.data?.stores || [] : [];
      setProducts(previous => page === 1 ? nextProducts : [...previous, ...nextProducts]);
      setStores(previous => page === 1 ? nextStores : [...previous, ...nextStores]);
      setHasMore(full && (
        (productData.data?.pagination?.total || 0) > page * pageSize ||
        (storeData.data?.pagination?.total || 0) > page * pageSize
      ));
    }).catch(() => { if (active) setMessage('Could not load the catalogue. Please try again.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [search, full, page]);

  async function addToCart(product) {
    const session = getSession();
    if (session && session.user.role !== 'customer') {
      setMessage('Please sign in with a customer account to add products.');
      return;
    }
    if (!session) {
      addGuestItem(product._id, 1);
      setMessage(`${product.name} added to your cart.`);
      return;
    }
    try {
      const response = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      if (response.ok) window.dispatchEvent(new Event('localbiz:cart'));
      setMessage(response.ok ? `${product.name} added to your cart.` : 'Could not add this product to your cart.');
    } catch { setMessage('Could not add this product to your cart.'); }
  }

  return <section id="catalogue" className="catalogue-section">
    <div className="catalogue-heading"><div><p className="landing-kicker">Browse LocalBiz</p><h2>Products and verified stores</h2></div>{!full && <Link href="/browse">View all →</Link>}</div>
    <form className="catalogue-search" onSubmit={event => { event.preventDefault(); setPage(1); setSearch(query.trim()); }} role="search">
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products or stores" aria-label="Search products or stores" />
      <button type="submit">Search</button>
    </form>
    {message && <p role="status" className="catalogue-message">{message}</p>}
    {loading ? <p>Loading products and stores…</p> : <>
      <h3>Products</h3>
      {products.length ? <div className="catalogue-grid">{products.map(product => <article key={product._id} className="catalogue-card">
        <Link href={`/product/${product._id}`}><div className="catalogue-image">{product.images?.[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <span className="material-symbols-outlined">inventory_2</span>}</div><h4>{product.name}</h4><p>{product.business?.storeName}</p></Link>
        <div className="catalogue-card-bottom"><strong>Rs. {Number(product.price).toLocaleString()}</strong><button type="button" onClick={() => addToCart(product)} disabled={product.stockQty < 1}>Add to cart</button></div>
      </article>)}</div> : <p>No matching products found.</p>}
      <h3>Verified stores</h3>
      {stores.length ? <div className="catalogue-grid">{stores.map(store => <Link key={store._id} href={`/store/${store._id}`} className="catalogue-card catalogue-store">
        <div className="catalogue-image">{store.coverImage || store.logo ? <img src={store.coverImage || store.logo} alt="" loading="lazy" /> : <span className="material-symbols-outlined">storefront</span>}</div>
        <h4>{store.storeName}</h4><p>{store.city || 'Local store'} · Verified</p>
      </Link>)}</div> : <p>No matching stores found.</p>}
      {hasMore && <button type="button" className="catalogue-more" onClick={() => setPage(value => value + 1)}>Load more</button>}
    </>}
  </section>;
}
