'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import styles from './store.module.css';
import { getSession } from '../../../lib/session';

const API = "";
const money = value => `Rs. ${Number(value || 0).toLocaleString('en-PK')}`;

export default function StoreDetailPage() {
  const { id: storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All products');
  const [sort, setSort] = useState('featured');
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    const token = getSession()?.user?.role === 'customer' ? getSession().token : null;
    setIsGuest(!token);
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [storeResponse, productsResponse] = await Promise.all([
          fetch(`${API}/api/v1/stores/${storeId}`),
          fetch(`${API}/api/v1/stores/${storeId}/products?limit=50`),
        ]);
        const [storeData, productsData] = await Promise.all([
          storeResponse.json(), productsResponse.json(),
        ]);
        if (!active) return;
        if (!storeResponse.ok || !storeData.success) {
          setError(storeResponse.status === 404 ? 'This store is no longer available.' : 'We could not load this store. Please try again.');
          return;
        }
        setStore(storeData.data);
        if (!productsResponse.ok || !productsData.success) setError('The products could not be loaded. Please refresh this page.');
        else setProducts(productsData.data?.products || []);
      } catch {
        if (active) setError('We could not connect to the store. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, [storeId]);

  const categories = useMemo(() => ['All products', ...new Set(products.map(product => product.category).filter(Boolean))], [products]);
  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = products.filter(product =>
      (category === 'All products' || product.category === category) &&
      (!query || `${product.name} ${product.description || ''}`.toLowerCase().includes(query))
    );
    if (sort === 'price-low') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, category, search, sort]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.breadcrumb}><Link href="/browse">Marketplace</Link><span>/</span><span>Stores</span><span>/</span><strong>{store?.storeName || 'Store'}</strong></div>
        {loading ? <div className={styles.statePanel} role="status"><span className={styles.loader} /><h1>Opening the store</h1><p>Finding the latest from this local business.</p></div>
        : !store ? <div className={styles.statePanel}><span className="material-symbols-outlined">storefront</span><h1>Store unavailable</h1><p>{error || 'We could not find this store.'}</p><Link href="/home" className={styles.primaryLink}>Explore other stores <span aria-hidden="true">↗</span></Link></div>
        : <>
          <section className={styles.hero} aria-labelledby="store-title">
            <div className={styles.heroVisual}>
              {store.coverImage ? <img src={store.coverImage} alt="" /> : <div className={styles.heroPattern}><span>LOCAL GOODS<br />GOOD STORIES</span></div>}
              <div className={styles.heroShade} />
              <span className={styles.verified}><span className="material-symbols-outlined">verified</span> Verified local store</span>
            </div>
            <div className={styles.heroBody}>
              <div className={styles.storeIdentity}>
                <div className={styles.logo}>{store.logo ? <img src={store.logo} alt={`${store.storeName} logo`} /> : <span>{store.storeName?.charAt(0)?.toUpperCase() || 'S'}</span>}</div>
                <div className={styles.identityText}><p className={styles.eyebrow}>{store.category?.name || 'Local business'} <span>·</span> {store.city || 'Pakistan'}</p><h1 id="store-title">{store.storeName}</h1><p className={styles.description}>{store.description || `Explore thoughtfully selected products from ${store.storeName}.`}</p></div>
              </div>
              <div className={styles.heroFacts}>
                <div><span className="material-symbols-outlined">inventory_2</span><strong>{products.length}</strong><span>products</span></div>
                <div><span className="material-symbols-outlined">location_on</span><strong>{store.city || 'Local'}</strong><span>based in</span></div>
                {store.rating > 0 && <div><span className="material-symbols-outlined">star</span><strong>{Number(store.rating).toFixed(1)}</strong><span>{store.totalReviews || 0} reviews</span></div>}
              </div>
            </div>
          </section>
          <section className={styles.productsSection} aria-labelledby="products-title">
            <div className={styles.sectionHeading}><div><p className={styles.sectionKicker}>THE COLLECTION</p><h2 id="products-title">Explore the store</h2><p>Discover what {store.storeName} has to offer.</p></div><span className={styles.resultCount}>{visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'items'}</span></div>
            <div className={styles.toolbar}>
              <label className={styles.searchBox}><span className="material-symbols-outlined">search</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search this store" aria-label="Search this store" />{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}</label>
              <label className={styles.sortBox}><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label>
            </div>
            {categories.length > 1 && <div className={styles.categories} role="group" aria-label="Product categories">{categories.map(item => <button key={item} type="button" className={category === item ? styles.categoryActive : styles.categoryButton} onClick={() => setCategory(item)}>{item}</button>)}</div>}
            {error && <p className={styles.inlineError} role="alert">{error}</p>}
            {visibleProducts.length === 0 ? <div className={styles.emptyProducts}><span className="material-symbols-outlined">shopping_bag</span><h3>{products.length === 0 ? 'Products are coming soon' : 'No matching products'}</h3><p>{products.length === 0 ? 'Check back soon for new arrivals from this store.' : 'Try another search or category to explore more.'}</p>{products.length > 0 && <button type="button" onClick={() => { setSearch(''); setCategory('All products'); }}>Clear filters</button>}</div>
            : <div className={styles.grid}>{visibleProducts.map(product => <Link key={product._id} href={`/product/${product._id}`} className={styles.productCard}>
              <div className={styles.productImage}>{product.images?.[0] ? <img src={product.images[0]} alt={product.name} loading="lazy" /> : <span className="material-symbols-outlined">inventory_2</span>}{product.stockQty <= 0 && <span className={styles.soldOut}>Sold out</span>}{product.stockQty > 0 && <span className={styles.viewProduct} aria-hidden="true"><span className="material-symbols-outlined">arrow_outward</span></span>}</div>
              <div className={styles.productDetails}><p>{product.category || store.category?.name || 'Local find'}</p><h3>{product.name}</h3><div><strong>{money(product.price)}</strong><span>View details <span aria-hidden="true">→</span></span></div></div>
            </Link>)}</div>}
          </section>
          {store.location?.coordinates?.length === 2 && <section className="mb-8 rounded-lg border border-[#d8ddd2] bg-white p-5"><h2 className="text-xl font-bold text-[#253027]">Find this store</h2><p className="mt-2 text-sm text-slate-600">{store.address}, {store.city}</p><a className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#31543d] underline" href={`https://www.openstreetmap.org/?mlat=${store.location.coordinates[1]}&mlon=${store.location.coordinates[0]}#map=16/${store.location.coordinates[1]}/${store.location.coordinates[0]}`} target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined">map</span>Open location on map</a></section>}
          <section className={styles.storyBanner}><div><p className={styles.sectionKicker}>SHOP CLOSE TO HOME</p><h2>Every order has a local story.</h2><p>Thanks for supporting independent businesses in your community.</p></div><Link href="/home">Explore more stores <span aria-hidden="true">↗</span></Link></section>
        </>}
      </main>
      <nav className={styles.mobileNav} aria-label="Mobile navigation"><Link href="/browse"><span className="material-symbols-outlined">explore</span>Discover</Link><Link href="/cart"><span className="material-symbols-outlined">shopping_bag</span>Cart</Link>{isGuest ? <Link href="/login"><span className="material-symbols-outlined">person</span>Sign in</Link> : <><Link href="/orders"><span className="material-symbols-outlined">receipt_long</span>Orders</Link><Link href="/profile"><span className="material-symbols-outlined">person</span>Profile</Link></>}</nav>
    </div>
  );
}
