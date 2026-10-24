'use client';

import { useState } from 'react';
import Link from 'next/link';
import StoreLocationPicker from '../../components/StoreLocationPicker';

export default function NearbyStoresPage() {
  const [location, setLocation] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);
  const [stores, setStores] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const search = async event => {
    event.preventDefault();
    const latitude = Number(location?.latitude);
    const longitude = Number(location?.longitude);
    if (location?.latitude == null || location?.longitude == null || location.latitude === '' || location.longitude === '' || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setMessage('Choose a valid location on the map or enter coordinates.');
      return;
    }
    setLoading(true);
    setMessage('');
    setSearched(false);
    try {
      const params = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), radiusKm: String(radiusKm), limit: '50' });
      const response = await fetch(`/api/v1/stores/nearby?${params}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Could not search nearby stores.');
      setStores(data.data.stores || []);
      setSearched(true);
    } catch (error) { setMessage(error.message || 'Could not search nearby stores.'); }
    finally { setLoading(false); }
  };

  return <main className="mx-auto w-full max-w-5xl px-5 py-10"><h1 className="text-3xl font-bold text-[#253027]">Stores near you</h1><p className="mt-2 text-slate-600">Find verified local stores by distance.</p>
    <form onSubmit={search} className="mt-7 space-y-5 rounded-xl border border-slate-200 bg-white p-5"><StoreLocationPicker value={location} onChange={setLocation} purpose="search" /><div className="flex flex-wrap items-end gap-4"><label className="text-sm font-semibold text-slate-600">Within<select value={radiusKm} onChange={event => setRadiusKm(Number(event.target.value))} className="mt-1 block rounded-lg border border-slate-300 bg-white px-3 py-2">{[1, 2, 5, 10, 20, 50].map(radius => <option key={radius} value={radius}>{radius} km</option>)}</select></label><button type="submit" disabled={loading} className="rounded-lg bg-[#31543d] px-6 py-2.5 font-semibold text-white disabled:opacity-50">{loading ? 'Searching…' : 'Find nearby stores'}</button></div>{message && <p role="status" className="text-sm text-red-600">{message}</p>}</form>
    {searched && <section className="mt-8"><h2 className="text-xl font-bold">{stores.length ? `${stores.length} nearby ${stores.length === 1 ? 'store' : 'stores'}` : 'No stores with a saved location in this area'}</h2>{!stores.length && <p className="mt-2 text-slate-600">Try a larger distance. Existing stores can add their pin from Store Profile.</p>}<div className="mt-4 grid gap-4 sm:grid-cols-2">{stores.map(store => <Link href={`/store/${store._id}`} key={store._id} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 hover:border-[#31543d]">{store.logo ? <img src={store.logo} alt="" className="h-16 w-16 rounded-lg object-cover" /> : <span className="material-symbols-outlined grid h-16 w-16 place-items-center rounded-lg bg-[#e0e8dc] text-[#31543d]">storefront</span>}<span className="min-w-0"><strong className="block truncate text-[#253027]">{store.storeName}</strong><span className="block text-sm text-slate-600">{store.city}{store.address ? ` · ${store.address}` : ''}</span><span className="mt-1 block text-sm font-semibold text-[#31543d]">{store.distanceKm} km away</span></span></Link>)}</div></section>}
  </main>;
}
