'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession } from '../../lib/session';

export default function RecommendationsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const [addingId, setAddingId] = useState(null);

  const loadRecommendations = useCallback(async () => {
    const session = getSession();
    if (!session || session.user.role !== 'customer') {
      router.replace('/login?next=%2Frecommendations');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/v1/recommendations?limit=30', {
        headers: { Authorization: `Bearer ${session.token}` },
        cache: 'no-store',
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) throw new Error('Recommendations are temporarily unavailable.');
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not load recommendations.');
      setProducts(Array.isArray(data.data?.products) ? data.data.products : []);
    } catch (err) {
      setError(err.message || 'Could not load recommendations.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { loadRecommendations(); }, [loadRecommendations]);

  const addToCart = async product => {
    const session = getSession();
    if (!session || session.user.role !== 'customer') {
      router.replace('/login?next=%2Frecommendations');
      return;
    }
    setAddingId(product._id);
    setCartMessage('');
    try {
      const response = await fetch('/api/v1/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not add the product.');
      window.dispatchEvent(new Event('localbiz:cart'));
      setCartMessage(`${product.name} added to your cart.`);
    } catch (err) {
      setCartMessage(err.message || 'Could not add the product.');
    } finally {
      setAddingId(null);
    }
  };

  return <main className="min-h-screen w-full bg-[#f7f5ef] px-5 py-10 md:px-10 text-[#253027]">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a14f32] mb-2">For you</p>
          <h1 className="text-3xl md:text-4xl font-bold">Recommended products</h1>
          <p className="mt-2 text-sm text-slate-600">Discover products from verified local stores, ordered for your interests.</p>
        </div>
        <button type="button" onClick={loadRecommendations} disabled={loading} className="rounded-lg border border-[#31543d] px-4 py-2.5 text-sm font-semibold text-[#31543d] hover:bg-[#e7eee5] disabled:opacity-50">
          {loading ? 'Loading…' : 'Refresh suggestions'}
        </button>
      </div>

      {cartMessage && <p role="status" className="mb-5 rounded-lg border border-[#b9c9b4] bg-white px-4 py-3 text-sm font-medium">{cartMessage}</p>}
      {loading ? <p role="status" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-600">Finding products for you…</p>
        : error ? <div role="alert" className="rounded-xl border border-red-200 bg-white p-10 text-center"><p className="text-red-700">{error}</p><button type="button" onClick={loadRecommendations} className="mt-4 text-sm font-semibold text-[#31543d] underline">Try again</button></div>
        : products.length === 0 ? <div className="rounded-xl border border-slate-200 bg-white p-10 text-center"><span className="material-symbols-outlined text-4xl text-[#31543d]">explore</span><h2 className="mt-3 text-xl font-bold">No recommendations yet</h2><p className="mt-2 text-sm text-slate-600">Explore products from verified stores. Your recommendations will appear as products become available.</p><Link href="/browse" className="mt-5 inline-block rounded-lg bg-[#31543d] px-5 py-3 text-sm font-semibold text-white">Search products</Link></div>
        : <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map(product => <article key={product._id} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white hover:border-[#31543d]">
            <Link href={`/product/${product._id}`} className="block">
              <div className="flex h-36 items-center justify-center bg-[#eef1eb] text-[#789080]">
                {product.images?.[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" className="h-full w-full object-cover" /> : <span className="material-symbols-outlined text-4xl" aria-hidden="true">inventory_2</span>}
              </div>
              <div className="px-3 pt-3">
                <h2 className="line-clamp-2 text-sm font-bold">{product.name}</h2>
                <p className="mt-1 truncate text-xs text-slate-500">{product.business?.storeName || 'Local store'}</p>
              </div>
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 pb-3 pt-2">
              <strong className="text-sm text-[#31543d]">Rs. {Number(product.price).toLocaleString()}</strong>
              <button type="button" onClick={() => addToCart(product)} disabled={addingId === product._id || product.stockQty < 1} className="rounded-lg bg-[#31543d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{addingId === product._id ? 'Adding…' : 'Add to cart'}</button>
            </div>
          </article>)}
        </div>}
    </div>
  </main>;
}
