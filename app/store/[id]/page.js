'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

export default function StoreDetailPage() {
  const router = useRouter();
  const params = useParams();
  const storeId = params.id;

  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch store details
    const fetchStore = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/stores/${storeId}`
    )
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStore(data.data);
        }
      })
      .catch(err => console.error('Failed to fetch store:', err));

    // Fetch store products
    const fetchProducts = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/stores/${storeId}/products?limit=50`
    )
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.products) {
          setProducts(data.data.products);
        }
      })
      .catch(err => console.error('Failed to fetch products:', err));

    // Fetch cart data for stats
    const fetchCart = fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/cart`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data?.items) {
          setCartCount(data.data.items.length);
        }
      })
      .catch(err => console.error('Failed to fetch cart:', err));

    Promise.all([fetchStore, fetchProducts, fetchCart]).finally(() => {
      setLoading(false);
    });
  }, [storeId]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <>
      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      <div className="flex min-h-screen bg-[#f7f9fb]">
        {/* Sidebar Navigation */}
        <aside className="h-screen w-72 fixed left-0 top-0 bg-[#f2f4f6] flex flex-col p-4 space-y-2 font-['Inter'] text-[13px] font-medium z-40">
          <div className="flex items-center gap-3 px-3 py-6 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                diamond
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#191c1e] leading-none">
                LocalBiz
              </h1>
              <p className="text-[11px] text-slate-500 font-normal">Marketplace</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            <Link
              href="/home"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined">home</span>
              <span>Browse</span>
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-[#eceef0] hover:translate-x-1 transition-all rounded-lg cursor-pointer relative"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              <span>My Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto bg-[#4648d4] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* User Info Card */}
          <div className="p-4 bg-white/60 rounded-2xl border border-white/40">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">
              Store
            </p>
            <p className="text-sm font-bold text-[#191c1e] truncate">
              {store?.storeName || 'Loading...'}
            </p>
            <p className="text-xs text-slate-500 mt-2">Explore products</p>
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
        <main className="ml-72 flex-1 p-8 space-y-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#4648d4] hover:text-[#6b38d4] font-semibold text-sm transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Stores
          </button>

          {loading ? (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-[#4648d4] rounded-full mx-auto"></div>
              <p className="text-slate-500 mt-4">Loading store details...</p>
            </div>
          ) : store ? (
            <>
              {/* Store Header */}
              <section className="glass-card rounded-2xl p-8 space-y-6">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-[#191c1e] mb-2">
                      {store.storeName}
                    </h1>
                    <p className="text-slate-500 mb-4">{store.description}</p>
                    <div className="flex items-center gap-6 flex-wrap">
                      {store.city && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="material-symbols-outlined text-lg">
                            location_on
                          </span>
                          <span className="font-semibold">{store.city}</span>
                        </div>
                      )}
                      {store.rating && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <span>⭐</span>
                          <span className="font-semibold">{store.rating.toFixed(1)} / 5</span>
                        </div>
                      )}
                      {store.category && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <span className="material-symbols-outlined text-lg">
                            category
                          </span>
                          <span className="font-semibold">
                            {store.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-[#4648d4]/10 to-[#6b38d4]/10 flex items-center justify-center">
                    <span
                      className="material-symbols-outlined text-5xl text-[#4648d4]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      store
                    </span>
                  </div>
                </div>
              </section>

              {/* Products Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#191c1e] flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-[#4648d4]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        inventory_2
                      </span>
                      Products
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Browse {products.length} products from this store
                    </p>
                  </div>
                  <Link
                    href="/cart"
                    className="flex items-center gap-2 px-4 py-2 bg-[#4648d4] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">
                      shopping_cart
                    </span>
                    Cart ({cartCount})
                  </Link>
                </div>

                {products.length === 0 ? (
                  <div className="glass-card rounded-2xl p-16 text-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-3xl text-slate-400">
                        inventory_2
                      </span>
                    </div>
                    <p className="text-[#191c1e] font-bold text-lg">
                      No products available yet
                    </p>
                    <p className="text-slate-500 text-sm mt-1">
                      Check back soon for amazing products from this store!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        className="glass-card rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
                      >
                        <div className="h-40 w-full bg-slate-100 relative overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              src={product.images[0]}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <span className="material-symbols-outlined text-4xl">
                                inventory_2
                              </span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#191c1e]">
                            {product.category || 'Product'}
                          </div>
                          {product.stockQty === 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h6 className="font-bold text-[#191c1e] truncate text-sm">
                              {product.name}
                            </h6>
                            <p className="text-xs text-slate-500 truncate">
                              {store.storeName}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                            <span className="text-[#4648d4] font-bold text-sm">
                              PKR {product.price?.toLocaleString()}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                product.stockQty > 0
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-600'
                              }`}
                            >
                              {product.stockQty > 0 ? 'In Stock' : 'Out'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="glass-card rounded-2xl p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl text-slate-400">
                  error
                </span>
              </div>
              <p className="text-[#191c1e] font-bold text-lg">
                Store not found
              </p>
              <p className="text-slate-500 text-sm mt-1">
                The store you're looking for doesn't exist.
              </p>
              <Link
                href="/home"
                className="mt-4 inline-block text-[#4648d4] font-semibold hover:underline"
              >
                Back to Stores
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
