'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StoresPage() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [stores, setStores] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ search: query, page: String(page), limit: '12' });
        const response = await fetch(`/api/v1/stores?${params}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || 'Could not load stores.');
        if (controller.signal.aborted) return;
        setStores(data.data.stores || []);
        setPagination(data.data.pagination);
      } catch (err) {
        if (!controller.signal.aborted) setError(err.message || 'Could not load stores.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [query, page, retry]);

  return <main className="min-h-screen min-w-0 bg-[#f7f5ef] px-5 py-10 md:px-10 text-[#253027]">
    <div className="mx-auto max-w-7xl">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#a14f32]">Shop local</p>
      <h1 className="text-3xl font-bold md:text-4xl">All stores</h1>
      <p className="mt-2 text-sm text-slate-600">Discover verified local businesses and explore their products.</p>
      <form role="search" onSubmit={event => { event.preventDefault(); setPage(1); setQuery(search.trim()); }} className="my-6 flex flex-wrap gap-3">
        <label htmlFor="store-search" className="sr-only">Search stores</label>
        <input id="store-search" type="search" maxLength={80} placeholder="Search stores by name or description" value={search} onChange={event => setSearch(event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3" />
        <button className="rounded-lg bg-[#31543d] px-5 py-3 font-semibold text-white" type="submit">Search</button>
        {query && <button type="button" onClick={() => { setSearch(''); setQuery(''); setPage(1); }} className="rounded-lg border border-[#31543d] px-4 py-3 text-[#31543d]">Clear search</button>}
      </form>
      {loading ? <p role="status" className="py-12 text-center">Loading stores…</p>
        : error ? <div role="alert" className="rounded-lg border border-red-200 bg-white p-8 text-center"><p className="text-red-700">{error}</p><button type="button" onClick={() => setRetry(value => value + 1)} className="mt-3 font-semibold underline">Try again</button></div>
        : <>
          <p role="status" className="mb-4 text-sm text-slate-600">{pagination.total} {pagination.total === 1 ? 'store' : 'stores'}{query ? ` matching “${query}”` : ' available'}</p>
          {stores.length === 0 ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center"><h2 className="text-xl font-bold">No stores found</h2><p className="mt-2 text-slate-600">{query ? 'Try another store name or clear your search.' : 'Check back soon for local stores.'}</p></div>
            : <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stores.map(store => <Link key={store._id} href={`/store/${store._id}`} className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white hover:border-[#31543d]">
                <div className="relative flex h-40 items-center justify-center bg-[#e0e8dc]">
                  {store.coverImage || store.logo ? <img src={store.coverImage || store.logo} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="material-symbols-outlined text-4xl text-[#31543d]" aria-hidden="true">store</span>}
                  <span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-xs font-semibold text-emerald-700">Verified</span>
                </div>
                <div className="space-y-2 p-4">
                  <h2 className="break-words text-lg font-bold">{store.storeName}</h2>
                  <p className="text-xs text-slate-500">{store.city || 'Local'} · {store.category?.name || 'Local store'}</p>
                  {store.description && <p className="line-clamp-2 break-words text-sm text-slate-600">{store.description}</p>}
                  <span className="inline-block text-sm font-semibold text-[#31543d]">Visit store →</span>
                </div>
              </Link>)}
            </div>}
          {pagination.totalPages > 1 && <nav aria-label="Store pages" className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)} className="rounded-lg border border-[#31543d] px-4 py-2 disabled:opacity-40">Previous</button>
            <span className="text-sm">Page {page} of {pagination.totalPages}</span>
            <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage(value => value + 1)} className="rounded-lg border border-[#31543d] px-4 py-2 disabled:opacity-40">Next</button>
          </nav>}
        </>}
    </div>
  </main>;
}
